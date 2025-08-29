import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrdemSolicitacao } from "@/types";

export const useOrdensAprovadas = () => {
  const [ordens, setOrdens] = useState<OrdemSolicitacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdens = async () => {
    try {
      setLoading(true);
      
      // Consultar ordens aprovadas na tabela ordem_solicitacoes
      const { data, error } = await supabase
        .from('ordem_solicitacoes')
        .select(`
          id, 
          numero_ordem,
          contrato_id,
          solicitante,
          secretaria,
          justificativa,
          quantidade,
          status,
          criado_em,
          decidido_em,
          decidido_por,
          motivo_decisao,
          contrato:contratos (
            id, 
            numero,
            objeto,
            fornecedor:fornecedores ( 
              id, 
              nome,
              cnpj
            )
          )
        `)
        .eq('status', 'APROVADA')
        .order('decidido_em', { ascending: false });

      if (error) throw error;

      const transformedOrdens: OrdemSolicitacao[] = (data || []).map(ordem => ({
        id: ordem.id,
        numero_ordem: ordem.numero_ordem, // ✅ Adicionando campo numero_ordem
        contrato_id: ordem.contrato_id,
        solicitante: ordem.solicitante,
        secretaria: ordem.secretaria,
        justificativa: ordem.justificativa,
        quantidade: ordem.quantidade,
        status: ordem.status,
        criado_em: ordem.criado_em,
        decidido_por: ordem.decidido_por,
        decidido_em: ordem.decidido_em,
        motivo_decisao: ordem.motivo_decisao,
        contrato: ordem.contrato ? {
          id: ordem.contrato.id,
          numero: ordem.contrato.numero,
          objeto: ordem.contrato.objeto,
          fornecedor: ordem.contrato.fornecedor ? {
            id: ordem.contrato.fornecedor.id,
            nome: ordem.contrato.fornecedor.nome,
            cnpj: ordem.contrato.fornecedor.cnpj
          } : null
        } : null
      }));

      setOrdens(transformedOrdens);
    } catch (error: any) {
      console.error("Erro ao carregar ordens aprovadas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdens();
  }, []);

  return { ordens, loading, refetch: fetchOrdens };
};
