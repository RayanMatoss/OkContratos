import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrdemFornecimento } from "@/types";

export const useOrdensAprovadas = () => {
  const [ordens, setOrdens] = useState<OrdemFornecimento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdens = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Iniciando busca de ordens aprovadas...');
      
      // Teste 1: Verificar TODAS as ordens (sem filtro)
      const { data: todasOrdens, error: todasError } = await supabase
        .from('ordens')
        .select('id, numero, status');
      
      console.log('🔍 Todas as ordens (sem filtro):', todasOrdens);
      console.log('🔍 Status das ordens encontradas:', todasOrdens?.map(o => ({ numero: o.numero, status: o.status })));
      
      const { data, error } = await supabase
        .from('ordens')
        .select(`
          id, numero, data_emissao, status, contrato_id,
          contrato:contratos (
            id, numero,
            fornecedor:fornecedores ( id, nome )
          )
        `)
        .eq('status', 'Aprovada')
        .order('data_emissao', { ascending: false });
      
      console.log('🔍 Resultado da consulta:', { data, error });
      console.log('🔍 Quantidade de ordens encontradas:', data?.length || 0);

      if (error) throw error;

      const transformedOrdens: OrdemFornecimento[] = (data || []).map(ordem => ({
        id: ordem.id,
        numero: ordem.numero,
        contratoId: ordem.contrato_id,
        contrato: ordem.contrato ? {
          id: ordem.contrato.id,
          numero: ordem.contrato.numero,
          fornecedores: ordem.contrato.fornecedor ? [{
            id: ordem.contrato.fornecedor.id,
            nome: ordem.contrato.fornecedor.nome
          }] : []
        } : undefined,
        dataEmissao: new Date(ordem.data_emissao),
        status: ordem.status,
        itens: [],
        valorTotal: 0,
        createdAt: new Date(ordem.data_emissao)
      }));

      setOrdens(transformedOrdens);
    } catch (error: any) {
      console.error("Erro ao carregar ordens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdens();
  }, []);

  return { ordens, loading, refetch: fetchOrdens };
};
