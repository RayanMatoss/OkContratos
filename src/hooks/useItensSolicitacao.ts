import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ItemSolicitacao {
  id: string;
  item_id: string;
  quantidade: number;
  item: {
    descricao: string;
    unidade: string;
    valor_unitario: number;
  };
}

export function useItensSolicitacao(solicitacaoId: string | null) {
  const [itens, setItens] = useState<ItemSolicitacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarItens = async () => {
    if (!solicitacaoId) {
      setItens([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Consulta direta na VIEW consolidada
      const { data, error: viewError } = await supabase
        .from('view_solicitacoes_com_itens')
        .select('*')
        .eq('solicitacao_id', solicitacaoId);

      if (viewError) {
        setError(viewError.message);
        return;
      }

      // Tratar quando não há itens (null ou array vazio)
      if (!data || data.length === 0) {
        setItens([]);
        return;
      }

      // Filtrar apenas registros que têm itens (item_id não é null)
      const itensComDados = data.filter(item => item.item_id !== null);
      
      if (itensComDados.length === 0) {
        setItens([]);
        return;
      }

      // Transformar dados da VIEW para o formato esperado
      const itensFormatados = itensComDados.map(item => ({
        id: item.item_solicitacao_id,
        item_id: item.item_id,
        quantidade: item.quantidade_item,
        item: {
          descricao: item.descricao_item || 'Item sem descrição',
          unidade: item.unidade || 'N/A',
          valor_unitario: item.valor_unitario || 0
        }
      }));

      setItens(itensFormatados);

    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarItens();
  }, [solicitacaoId]);

  // Calcular valores totais
  const valorTotal = itens.reduce((total, item) => {
    return total + (item.quantidade * (item.item?.valor_unitario || 0));
  }, 0);

  const quantidadeTotal = itens.reduce((total, item) => {
    return total + item.quantidade;
  }, 0);

  return {
    itens,
    loading,
    error,
    valorTotal,
    quantidadeTotal,
    refetch: buscarItens
  };
}
