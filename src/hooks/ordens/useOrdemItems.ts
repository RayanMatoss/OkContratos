
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types";

export const useOrdemItems = (contratoId: string) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [contratoId]);

  return { items, loading, refetch: fetchItems };
};
