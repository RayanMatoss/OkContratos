
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types";

export const useOrdemItems = (
  contratoId: string,
  mode: 'create' | 'edit' = 'create',
  ordemId?: string
) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantidade: number }[]>([]);

  const fetchItems = async () => {
    if (!contratoId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("itens")
        .select("*")
        .eq("contrato_id", contratoId);

      if (error) throw error;

      const formattedItems: Item[] = data.map(item => ({
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
    }
  };

  const updateConsumedItems = async (ordemId: string) => {
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
  };
};
