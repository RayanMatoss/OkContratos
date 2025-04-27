
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrdemFornecimento } from "@/types";

export const useOrdens = () => {
  const { toast } = useToast();
  const [ordens, setOrdens] = useState<OrdemFornecimento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdens = async () => {
    try {
      const { data, error } = await supabase
        .from("ordens")
        .select(`
          *,
          contrato:contratos (
            id,
            numero,
            fornecedor:fornecedores (
              id,
              nome
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOrdens: OrdemFornecimento[] = (data || []).map(ordem => ({
        id: ordem.id,
        numero: ordem.numero,
        contratoId: ordem.contrato_id,
        contrato: ordem.contrato ? {
          id: ordem.contrato.id,
          numero: ordem.contrato.numero,
          fornecedor: ordem.contrato.fornecedor ? {
            id: ordem.contrato.fornecedor.id,
            nome: ordem.contrato.fornecedor.nome
          } : undefined
        } : undefined,
        dataEmissao: new Date(ordem.data_emissao),
        status: ordem.status as any,
        itensConsumidos: [],
        createdAt: new Date(ordem.created_at)
      }));

      setOrdens(transformedOrdens);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar ordens",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdens();
  }, []);

  return {
    ordens,
    loading,
    refetch: fetchOrdens
  };
};
