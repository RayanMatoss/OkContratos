
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
            fornecedor_id,
            fundo_municipal,
            objeto,
            valor,
            data_inicio,
            data_termino,
            status,
            fornecedor:fornecedores (
              id,
              nome,
              cnpj,
              email,
              telefone,
              endereco
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
          fornecedorId: ordem.contrato.fornecedor_id,
          fundoMunicipal: ordem.contrato.fundo_municipal as any,
          objeto: ordem.contrato.objeto,
          valor: ordem.contrato.valor,
          dataInicio: new Date(ordem.contrato.data_inicio),
          dataTermino: new Date(ordem.contrato.data_termino),
          status: ordem.contrato.status as any,
          itens: [], // Empty array since we're not fetching items
          createdAt: new Date(ordem.created_at),
          fornecedor: ordem.contrato.fornecedor ? {
            id: ordem.contrato.fornecedor.id,
            nome: ordem.contrato.fornecedor.nome,
            cnpj: ordem.contrato.fornecedor.cnpj,
            email: ordem.contrato.fornecedor.email || "",
            telefone: ordem.contrato.fornecedor.telefone || "",
            endereco: ordem.contrato.fornecedor.endereco || "",
            createdAt: new Date() // Since we don't have created_at from the fornecedor in this query
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
