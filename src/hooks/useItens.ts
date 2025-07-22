
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types";

export const useItens = () => {
  const { toast } = useToast();
  const [itens, setItens] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItens = async () => {
    try {
      const { data, error } = await supabase
        .from('itens')
        .select(`
          *,
          contratos (
            numero
          )
        `);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const itensFormatados: Item[] = data.map((item) => ({
          id: item.id,
          contratoId: item.contrato_id,
          descricao: item.descricao,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valorUnitario: item.valor_unitario,
          quantidadeConsumida: item.quantidade_consumida,
          createdAt: new Date(item.created_at),
          fundos: Array.isArray(item.fundos) ? item.fundos : []
        }));
        setItens(itensFormatados);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao buscar itens",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchItens();
  };

  useEffect(() => {
    fetchItens();
  }, []);

  return {
    itens,
    loading,
    refetch
  };
};
