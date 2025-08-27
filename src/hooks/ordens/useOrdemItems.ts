
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types";

export const useOrdemItems = (
  contratoId: string,
  mode: 'create' | 'edit' = 'create',
  ordemId?: string
) => {
  const { toast } = useToast();
  const [contratoItems, setContratoItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<{itemId: string; quantidade: number}[]>([]);
  const [originalItemsConsumidos, setOriginalItemsConsumidos] = useState<{
    id: string;
    itemId: string;
    quantidade: number;
  }[]>([]);

  useEffect(() => {
    if (contratoId) {
      fetchContratoItems();
      
      if (mode === 'edit' && ordemId) {
        fetchConsumedItems(ordemId);
      }
    } else {
      setContratoItems([]);
      setSelectedItems([]);
    }
  }, [contratoId, mode, ordemId]);

  const fetchContratoItems = async () => {
    try {
      const { data, error } = await supabase
        .from("itens")
        .select("*")
        .eq("contrato_id", contratoId);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar itens do contrato",
          variant: "destructive",
        });
        return;
      }

      const transformedItems: Item[] = (data || []).map(item => ({
        id: item.id,
        contratoId: item.contrato_id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        valorUnitario: item.valor_unitario,
        unidade: item.unidade,
        quantidadeConsumida: item.quantidade_consumida,
        createdAt: new Date(item.created_at),
        fundos: item.fundos || []
      }));

      setContratoItems(transformedItems);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchConsumedItems = async (ordemId: string) => {
    try {
      const { data, error } = await supabase
        .from("itens_consumidos")
        .select("*")
        .eq("ordem_id", ordemId);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar itens consumidos",
          variant: "destructive",
        });
        return;
      }

      const consumedItems = (data || []).map(item => ({
        id: item.id,
        itemId: item.item_id,
        quantidade: item.quantidade
      }));
      setOriginalItemsConsumidos(consumedItems);
      
      // Mapear para selectedItems
      const mappedSelectedItems = consumedItems.map(item => ({
        itemId: item.itemId,
        quantidade: item.quantidade
      }));
      
      setSelectedItems(mappedSelectedItems);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addItem = (item: Item, quantidade: number) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.itemId === item.id);
      if (existing) {
        return prev.map(i => 
          i.itemId === item.id 
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        );
      }
      return [...prev, { itemId: item.id, quantidade }];
    });
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(i => i.itemId !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantidade: number) => {
    setSelectedItems(prev => 
      prev.map(i => i.itemId === itemId ? { ...i, quantidade } : i)
    );
  };

  const getAvailableQuantity = (item: Item) => {
    if (mode === 'create') {
      return item.quantidade - item.quantidadeConsumida;
    } else {
      // No modo edit, considerar itens já consumidos
      const originalConsumed = originalItemsConsumidos.find(ic => ic.itemId === item.id);
      const currentSelected = selectedItems.find(si => si.itemId === item.id);
      
      if (originalConsumed && currentSelected) {
        return item.quantidade - item.quantidadeConsumida + originalConsumed.quantidade - currentSelected.quantidade;
      }
      
      return item.quantidade - item.quantidadeConsumida;
    }
  };

  const updateConsumedItems = async (ordemId: string) => {
    try {
      // Primeiro, deletar itens existentes
      const { error: deleteError } = await supabase
        .from("itens_consumidos")
        .delete()
        .eq("ordem_id", ordemId);

      if (deleteError) throw deleteError;

      // Depois, inserir novos itens
      if (selectedItems.length > 0) {
        const itensConsumidos = selectedItems.map(item => ({
          ordem_id: ordemId,
          item_id: item.itemId,
          quantidade: item.quantidade
        }));

        const { error: insertError } = await supabase
          .from("itens_consumidos")
          .insert(itensConsumidos);

        if (insertError) throw insertError;
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Erro ao atualizar itens consumidos: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    contratoItems,
    selectedItems,
    setSelectedItems,
    addItem,
    removeItem,
    updateItemQuantity,
    getAvailableQuantity,
    updateConsumedItems,
    originalItemsConsumidos
  };
};
