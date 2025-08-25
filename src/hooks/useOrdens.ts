
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrdemFornecimento, ItemOrdem } from "@/types";

export const useOrdens = () => {
  const { toast } = useToast();
  const [ordens, setOrdens] = useState<OrdemFornecimento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdens = async () => {
    try {
      // Buscar ordens com dados do contrato e fornecedor
      const { data: ordensData, error: ordensError } = await supabase
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

      if (ordensError) throw ordensError;

      // Buscar itens consumidos para todas as ordens
      const { data: itensConsumidosData, error: itensError } = await supabase
        .from("itens_consumidos")
        .select(`
          id,
          ordem_id,
          quantidade,
          item: item_id (
            id,
            descricao,
            unidade,
            valor_unitario,
            contrato_id
          )
        `);

      if (itensError) throw itensError;

      // Criar mapa de itens por ordem
      const itensPorOrdem = new Map<string, ItemOrdem[]>();
      itensConsumidosData?.forEach(ic => {
        if (!itensPorOrdem.has(ic.ordem_id)) {
          itensPorOrdem.set(ic.ordem_id, []);
        }
        
        // Verificar se o item pertence ao contrato correto
        const ordem = ordensData?.find(o => o.id === ic.ordem_id);
        if (ordem && ic.item?.contrato_id === ordem.contrato_id) {
          itensPorOrdem.get(ic.ordem_id)?.push({
            id: ic.id,
            ordemId: ic.ordem_id,
            itemId: ic.item?.id || "",
            item: ic.item ? {
              id: ic.item.id,
              contratoId: ic.item.contrato_id,
              descricao: ic.item.descricao,
              quantidade: ic.quantidade,
              unidade: ic.item.unidade,
              valorUnitario: ic.item.valor_unitario,
              quantidadeConsumida: 0,
              createdAt: new Date()
            } : undefined,
            quantidade: ic.quantidade,
            valorUnitario: ic.item?.valor_unitario || 0,
            valorTotal: (ic.quantidade || 0) * (ic.item?.valor_unitario || 0)
          });
        }
      });

      const transformedOrdens: OrdemFornecimento[] = (ordensData || []).map(ordem => ({
        id: ordem.id,
        numero: ordem.numero,
        contratoId: ordem.contrato_id,
        contrato: ordem.contrato ? {
          id: ordem.contrato.id,
          numero: ordem.contrato.numero,
          fornecedorId: ordem.contrato.fornecedor_id,
          fundoMunicipal: Array.isArray(ordem.contrato.fundo_municipal) ? ordem.contrato.fundo_municipal : [],
          objeto: ordem.contrato.objeto,
          valor: ordem.contrato.valor,
          dataInicio: new Date(ordem.contrato.data_inicio),
          dataTermino: new Date(ordem.contrato.data_termino),
          status: ordem.contrato.status as any,
          itens: [], // Empty array since we're not fetching contract items
          createdAt: new Date(ordem.created_at),
          fornecedor: ordem.contrato.fornecedor ? {
            id: ordem.contrato.fornecedor.id,
            nome: ordem.contrato.fornecedor.nome,
            cnpj: ordem.contrato.fornecedor.cnpj,
            email: ordem.contrato.fornecedor.email || "",
            telefone: ordem.contrato.fornecedor.telefone || "",
            endereco: ordem.contrato.fornecedor.endereco || "",
            createdAt: new Date()
          } : undefined
        } : undefined,
        dataEmissao: new Date(ordem.data_emissao),
        observacoes: "",
        status: ordem.status as any,
        itens: itensPorOrdem.get(ordem.id) || [],
        valorTotal: (itensPorOrdem.get(ordem.id) || []).reduce((total, item) => total + item.valorTotal, 0),
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
