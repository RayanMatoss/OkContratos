import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ItemSaldo {
  id: string;
  descricao: string;
  quantidadeOriginal: number;
  quantidadeConsumida: number;
  saldoQuantidade: number;
  percentualConsumido: number;
  valorUnitario: number;
  valorTotal: number;
  valorConsumido: number;
  saldoValor: number;
}

interface ContratoSaldo {
  valorOriginal: number;
  valorConsumido: number;
  saldoAtual: number;
  percentualConsumido: number;
  itensSaldo: ItemSaldo[];
}

export const useContratoSaldo = (contratoId: string) => {
  const [saldo, setSaldo] = useState<ContratoSaldo>({
    valorOriginal: 0,
    valorConsumido: 0,
    saldoAtual: 0,
    percentualConsumido: 0,
    itensSaldo: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const calcularSaldo = async () => {
    try {
      setLoading(true);

      // Buscar o contrato para obter o valor original
      const { data: contrato, error: contratoError } = await supabase
        .from("contratos")
        .select("valor")
        .eq("id", contratoId)
        .single();

      if (contratoError) throw contratoError;

      const valorOriginal = contrato.valor || 0;

      // Buscar todos os itens do contrato
      const { data: itens, error: itensError } = await supabase
        .from("itens")
        .select(`
          id,
          descricao,
          quantidade,
          valor_unitario
        `)
        .eq("contrato_id", contratoId);

      if (itensError) throw itensError;

      // Buscar todas as ordens de fornecimento relacionadas ao contrato
      const { data: ordens, error: ordensError } = await supabase
        .from("ordens")
        .select(`
          id,
          status
        `)
        .eq("contrato_id", contratoId)
        .eq("status", "Concluída"); // Apenas ordens concluídas

      if (ordensError) throw ordensError;

      // Calcular o valor consumido pelas ordens e saldo por item
      let valorConsumido = 0;
      const itensSaldo: ItemSaldo[] = [];

      // Inicializar saldo dos itens
      if (itens && itens.length > 0) {
        itens.forEach(item => {
          const valorTotal = (item.quantidade || 0) * (item.valor_unitario || 0);
          itensSaldo.push({
            id: item.id,
            descricao: item.descricao,
            quantidadeOriginal: item.quantidade || 0,
            quantidadeConsumida: 0,
            saldoQuantidade: item.quantidade || 0,
            percentualConsumido: 0,
            valorUnitario: item.valor_unitario || 0,
            valorTotal: valorTotal,
            valorConsumido: 0,
            saldoValor: valorTotal
          });
        });
      }

      if (ordens && ordens.length > 0) {
        // Para cada ordem, buscar os itens consumidos
        for (const ordem of ordens) {
          const { data: itensConsumidos, error: itensConsumidosError } = await supabase
            .from("itens_consumidos")
            .select(`
              quantidade,
              item:item_id (
                id,
                valor_unitario
              )
            `)
            .eq("ordem_id", ordem.id);

          if (itensConsumidosError) throw itensConsumidosError;

          if (itensConsumidos && itensConsumidos.length > 0) {
            itensConsumidos.forEach((itemConsumido: any) => {
              const quantidade = itemConsumido.quantidade || 0;
              const valorUnitario = itemConsumido.item?.valor_unitario || 0;
              const itemId = itemConsumido.item?.id;
              
              valorConsumido += quantidade * valorUnitario;

              // Atualizar saldo do item específico
              const itemSaldo = itensSaldo.find(item => item.id === itemId);
              if (itemSaldo) {
                itemSaldo.quantidadeConsumida += quantidade;
                itemSaldo.saldoQuantidade = Math.max(0, itemSaldo.quantidadeOriginal - itemSaldo.quantidadeConsumida);
                itemSaldo.percentualConsumido = itemSaldo.quantidadeOriginal > 0 
                  ? (itemSaldo.quantidadeConsumida / itemSaldo.quantidadeOriginal) * 100 
                  : 0;
                itemSaldo.valorConsumido += quantidade * valorUnitario;
                itemSaldo.saldoValor = Math.max(0, itemSaldo.valorTotal - itemSaldo.valorConsumido);
              }
            });
          }
        }
      }

      const saldoAtual = valorOriginal - valorConsumido;
      const percentualConsumido = valorOriginal > 0 ? (valorConsumido / valorOriginal) * 100 : 0;

      setSaldo({
        valorOriginal,
        valorConsumido,
        saldoAtual: Math.max(0, saldoAtual), // Não pode ser negativo
        percentualConsumido: Math.min(100, percentualConsumido), // Máximo 100%
        itensSaldo
      });

    } catch (error: any) {
      console.error("Erro ao calcular saldo do contrato:", error);
      toast({
        title: "Erro ao calcular saldo",
        description: "Não foi possível calcular o saldo do contrato",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contratoId) {
      calcularSaldo();
    }
  }, [contratoId]);

  return {
    saldo,
    loading,
    refetch: calcularSaldo
  };
}; 