
import { useState, useEffect } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { useToast } from "@/hooks/use-toast";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types";

export const useOrdemItems = (
  contratoId: string,
  mode: 'create' | 'edit' = 'create',
  ordemId?: string
) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantidade: number }[]>([]);

  const fetchItems = async () => {
    if (!contratoId) return;
    
    setLoading(true);
<<<<<<< HEAD
=======
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
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    try {
      const { data, error } = await supabase
        .from("itens")
        .select("*")
        .eq("contrato_id", contratoId);

<<<<<<< HEAD
<<<<<<< HEAD
      if (error) throw error;

      const formattedItems: Item[] = data.map(item => ({
=======
      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar itens do contrato",
          variant: "destructive",
        });
        return;
      }

      const transformedItems: Item[] = (data || []).map(item => ({
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
      if (error) throw error;

      const formattedItems: Item[] = data.map(item => ({
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        id: item.id,
        contratoId: item.contrato_id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        valorUnitario: item.valor_unitario,
        unidade: item.unidade,
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        quantidadeConsumida: item.quantidade_consumida,
        createdAt: new Date(item.created_at),
        fundos: item.fundos || []
      }));

      setItems(formattedItems);

      // If in edit mode, fetch existing consumed items for this order
      if (mode === 'edit' && ordemId) {
        const { data: consumedData, error: consumedError } = await supabase
          .from("itens_consumidos")
          .select("item_id, quantidade")
          .eq("ordem_id", ordemId);

        if (consumedError) throw consumedError;

        const existingItems = (consumedData || []).map(item => ({
          itemId: item.item_id,
          quantidade: item.quantidade
        }));

        setSelectedItems(existingItems);
      }
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    } finally {
      setLoading(false);
<<<<<<< HEAD
=======
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
        .select("id, item_id, quantidade")
        .eq("ordem_id", ordemId);

      if (error) throw error;

      const consumedItems = (data || []).map(item => ({
        id: item.id,
        itemId: item.item_id,
        quantidade: item.quantidade
      }));

      setOriginalItemsConsumidos(consumedItems);
      setSelectedItems(consumedItems.map(item => ({
        itemId: item.itemId,
        quantidade: item.quantidade
      })));
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar itens consumidos: " + error.message,
        variant: "destructive",
      });
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    }
  };

  const updateConsumedItems = async (ordemId: string) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    try {
      // Delete existing consumed items for this order
      await supabase
        .from("itens_consumidos")
        .delete()
        .eq("ordem_id", ordemId);

      // Insert new consumed items
      if (selectedItems.length > 0) {
        const itensConsumidos = selectedItems.map(item => ({
          ordem_id: ordemId,
          item_id: item.itemId,
          quantidade: item.quantidade
        }));

        const { error } = await supabase
          .from("itens_consumidos")
          .insert(itensConsumidos);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Erro ao atualizar itens consumidos:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, [contratoId, mode, ordemId]);

  return { 
    contratoItems: items, 
    selectedItems, 
    setSelectedItems, 
    updateConsumedItems,
    loading, 
    refetch: fetchItems 
<<<<<<< HEAD
=======
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
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  };
};
