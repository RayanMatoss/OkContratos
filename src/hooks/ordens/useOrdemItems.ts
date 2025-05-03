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
        quantidadeConsumida: item.quantidade_consumida
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
        .select(`
          id,
          item_id,
          quantidade,
          item: item_id (
            descricao,
            unidade,
            valor_unitario
          )
        `)
        .eq("ordem_id", ordemId);

      if (error) throw error;

      const consumedItems = (data || []).map(item => ({
        id: item.id,
        itemId: item.item_id,
        quantidade: item.quantidade,
        descricao: item.item?.descricao,
        unidade: item.item?.unidade,
        valor_unitario: item.item?.valor_unitario
      }));

      setOriginalItemsConsumidos(consumedItems);
      setSelectedItems(consumedItems.map(item => ({
        itemId: item.itemId,
        quantidade: item.quantidade,
        descricao: item.descricao,
        unidade: item.unidade,
        valor_unitario: item.valor_unitario
      })));
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar itens consumidos: " + error.message,
        variant: "destructive",
      });
    }
  };

  const updateConsumedItems = async (ordemId: string) => {
    // Find items to create or update
    const itemsToAdd: {ordem_id: string; item_id: string; quantidade: number}[] = [];
    const itemsToUpdate: {id: string; quantidade: number}[] = [];
    const itemsToDelete: string[] = [];

    selectedItems.forEach(newItem => {
      const originalItem = originalItemsConsumidos.find(oi => oi.itemId === newItem.itemId);
      
      if (!originalItem) {
        itemsToAdd.push({
          ordem_id: ordemId,
          item_id: newItem.itemId,
          quantidade: newItem.quantidade
        });
      } else if (originalItem.quantidade !== newItem.quantidade) {
        itemsToUpdate.push({
          id: originalItem.id,
          quantidade: newItem.quantidade
        });
      }
    });

    originalItemsConsumidos.forEach(originalItem => {
      const stillExists = selectedItems.some(si => si.itemId === originalItem.itemId);
      if (!stillExists) {
        itemsToDelete.push(originalItem.id);
      }
    });

    // Execute the changes
    if (itemsToAdd.length > 0) {
      const { error: addError } = await supabase
        .from("itens_consumidos")
        .insert(itemsToAdd);
      
      if (addError) throw addError;
    }

    // Update items one by one to ensure triggers run properly
    for (const item of itemsToUpdate) {
      const { error: updateError } = await supabase
        .from("itens_consumidos")
        .update({ quantidade: item.quantidade })
        .eq("id", item.id);
      
      if (updateError) throw updateError;
    }

    if (itemsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("itens_consumidos")
        .delete()
        .in("id", itemsToDelete);
      
      if (deleteError) throw deleteError;
    }
  };

  return {
    contratoItems,
    selectedItems,
    setSelectedItems,
    updateConsumedItems
  };
};
