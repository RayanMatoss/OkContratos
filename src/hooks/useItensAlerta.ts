import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useContratoSaldo } from "./useContratoSaldo";

export interface ItemAlerta {
  id: string;
  descricao: string;
  quantidade: number;
  quantidade_consumida: number;
  percentual_consumido: number;
  contrato: {
    id: string;
    numero: string;
    fornecedores: Array<{ nome: string }>;
  };
}

export function useItensAlerta() {
  const { toast } = useToast();
  const [itensAlerta, setItensAlerta] = useState<ItemAlerta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItensAlerta = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // OTIMIZAÇÃO: Fazer apenas 1 consulta em vez de centenas
      const { data: itensComConsumo, error: itensError } = await supabase
        .from("itens")
        .select(`
          id,
          descricao,
          quantidade,
          valor_unitario,
          unidade,
          contrato_id,
          contratos!inner(
            id,
            numero,
            fornecedor_nome
          )
        `);

      if (itensError) throw itensError;

      // Buscar TODAS as ordens concluídas de uma vez
      const { data: todasOrdens, error: ordensError } = await supabase
        .from("ordens")
        .select(`
          id,
          contrato_id,
          status
        `)
        .eq("status", "Concluída");

      if (ordensError) throw ordensError;

      // Buscar TODOS os itens consumidos de uma vez
      const { data: todosItensConsumidos, error: itensConsumidosError } = await supabase
        .from("itens_consumidos")
        .select(`
          quantidade,
          ordem_id,
          item_id
        `);

      if (itensConsumidosError) throw itensConsumidosError;

      // Criar mapas para busca rápida
      const ordensPorContrato = new Map();
      const itensConsumidosPorOrdem = new Map();
      const itensConsumidosPorItem = new Map();

      // Organizar ordens por contrato
      todasOrdens?.forEach(ordem => {
        if (!ordensPorContrato.has(ordem.contrato_id)) {
          ordensPorContrato.set(ordem.contrato_id, []);
        }
        ordensPorContrato.get(ordem.contrato_id).push(ordem.id);
      });

      // Organizar itens consumidos por ordem
      todosItensConsumidos?.forEach(ic => {
        if (!itensConsumidosPorOrdem.has(ic.ordem_id)) {
          itensConsumidosPorOrdem.set(ic.ordem_id, []);
        }
        itensConsumidosPorOrdem.get(ic.ordem_id).push(ic);
      });

      // Organizar itens consumidos por item
      todosItensConsumidos?.forEach(ic => {
        if (!itensConsumidosPorItem.has(ic.item_id)) {
          itensConsumidosPorItem.set(ic.item_id, []);
        }
        itensConsumidosPorItem.get(ic.item_id).push(ic);
      });

      const todosItensAlerta: ItemAlerta[] = [];

      // Processar itens com consumo calculado
      itensComConsumo?.forEach(item => {
        const quantidade = parseFloat(item.quantidade) || 0;
        let quantidadeConsumida = 0;

        // Calcular consumo total do item
        const itensConsumidos = itensConsumidosPorItem.get(item.id) || [];
        itensConsumidos.forEach(ic => {
          const ordemId = ic.ordem_id;
          const ordem = todasOrdens?.find(o => o.id === ordemId);
          
          // Verificar se a ordem pertence ao contrato do item
          if (ordem && ordem.contrato_id === item.contrato_id) {
            quantidadeConsumida += parseFloat(ic.quantidade) || 0;
          }
        });

        // Calcular percentual real
        const percentualConsumido = quantidade > 0 ? (quantidadeConsumida / quantidade) * 100 : 0;

        // Se atende critério de 90% ou mais, adicionar ao alerta
        if (percentualConsumido >= 90) {
          todosItensAlerta.push({
            id: item.id,
            descricao: item.descricao,
            quantidade,
            quantidade_consumida: quantidadeConsumida,
            percentual_consumido: percentualConsumido,
            contrato: {
              id: item.contratos.id,
              numero: item.contratos.numero,
              fornecedores: item.contratos.fornecedor_nome ? [{ nome: item.contratos.fornecedor_nome }] : []
            }
          });
        }
      });

      // Ordenar por percentual decrescente
      const itensOrdenados = todosItensAlerta.sort((a, b) => b.percentual_consumido - a.percentual_consumido);

      setItensAlerta(itensOrdenados);
      return itensOrdenados;

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
      toast({
        title: "Erro ao carregar itens em alerta",
        description: msg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Carregar itens ao inicializar
  useEffect(() => {
    void fetchItensAlerta();
  }, [fetchItensAlerta]);

  return {
    itensAlerta,
    loading,
    error,
    fetchItensAlerta,
    refresh: fetchItensAlerta
  };
} 