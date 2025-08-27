
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
          item_id
        `);

      if (itensError) throw itensError;

      // Buscar os itens separadamente
      const itemIds = [...new Set(itensConsumidosData?.map(ic => ic.item_id) || [])];
      let itensData: any[] = [];
      
      if (itemIds.length > 0) {
        const { data: itens, error: itensError2 } = await supabase
          .from("itens")
          .select(`
            id,
            descricao,
            unidade,
            valor_unitario,
            contrato_id
          `)
          .in("id", itemIds);
        
        if (itensError2) throw itensError2;
        itensData = itens || [];
      }

      // Criar mapa de itens por ordem
      const itensPorOrdem = new Map<string, ItemOrdem[]>();
      itensConsumidosData?.forEach(ic => {
        const item = itensData.find(i => i.id === ic.item_id);
        
        if (!itensPorOrdem.has(ic.ordem_id)) {
          itensPorOrdem.set(ic.ordem_id, []);
        }
        
        // Verificar se o item pertence ao contrato correto
        const ordem = ordensData?.find(o => o.id === ic.ordem_id);
        if (ordem && item?.contrato_id === ordem.contrato_id) {
          itensPorOrdem.get(ic.ordem_id)?.push({
            id: ic.id,
            ordemId: ic.ordem_id,
            itemId: ic.item_id,
            item: item ? {
              id: item.id,
              contratoId: item.contrato_id,
              descricao: item.descricao,
              quantidade: ic.quantidade,
              unidade: item.unidade,
              valorUnitario: item.valor_unitario,
              quantidadeConsumida: 0,
              createdAt: new Date()
            } : undefined,
            quantidade: ic.quantidade,
            valorUnitario: item?.valor_unitario || 0,
            valorTotal: (ic.quantidade || 0) * (item?.valor_unitario || 0)
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
          fornecedorIds: [ordem.contrato.fornecedor_id],
          fundoMunicipal: Array.isArray(ordem.contrato.fundo_municipal) ? ordem.contrato.fundo_municipal as any : [],
          objeto: ordem.contrato.objeto,
          valor: ordem.contrato.valor,
          dataInicio: new Date(ordem.contrato.data_inicio),
          dataTermino: new Date(ordem.contrato.data_termino),
          status: ordem.contrato.status as any,
          itens: [], // Empty array since we're not fetching contract items
          createdAt: new Date(ordem.created_at),
          fornecedores: ordem.contrato.fornecedor ? [{
            id: ordem.contrato.fornecedor.id,
            nome: ordem.contrato.fornecedor.nome,
            cnpj: ordem.contrato.fornecedor.cnpj,
            email: ordem.contrato.fornecedor.email || "",
            telefone: ordem.contrato.fornecedor.telefone || "",
            endereco: ordem.contrato.fornecedor.endereco || "",
            createdAt: new Date()
          }] : []
        } : undefined,
                  dataEmissao: new Date(ordem.data_emissao),
          dataConclusao: undefined,

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
