import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrdemSolicitacao, ItemSolicitacao } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useOrdemSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<OrdemSolicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);

      // Buscar solicitações (ordem_solicitacoes)
      const { data: solicitacoesData, error: solicitacoesError } = await supabase
        .from("ordem_solicitacoes")
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
        .order('criado_em', { ascending: false });

      if (solicitacoesError) throw solicitacoesError;

      // Buscar itens da solicitação
      const { data: itensSolicitacaoData, error: itensError } = await supabase
        .from("itens_solicitacao")
        .select(`
          id,
          solicitacao_id,
          quantidade,
          item_id
        `);

      if (itensError) throw itensError;

      // Buscar os itens separadamente
      const itemIds = [...new Set(itensSolicitacaoData?.map(is => is.item_id) || [])];
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

      // Criar mapa de itens por solicitação
      const itensPorSolicitacao = new Map<string, ItemSolicitacao[]>();
      itensSolicitacaoData?.forEach(is => {
        const item = itensData.find(i => i.id === is.item_id);
        
        if (itensPorSolicitacao.has(is.solicitacao_id)) {
          itensPorSolicitacao.get(is.solicitacao_id)!.push({
            id: is.id,
            solicitacaoId: is.solicitacao_id,
            itemId: is.item_id,
            item: item ? {
              id: item.id,
              contratoId: item.contrato_id,
              descricao: item.descricao,
              quantidade: 0,
              unidade: item.unidade,
              valorUnitario: item.valor_unitario,
              quantidadeConsumida: 0,
              createdAt: new Date()
            } : undefined,
            quantidade: is.quantidade,
            valorUnitario: item?.valor_unitario || 0,
            valorTotal: (item?.valor_unitario || 0) * is.quantidade
          });
        } else {
          itensPorSolicitacao.set(is.solicitacao_id, [{
            id: is.id,
            solicitacaoId: is.solicitacao_id,
            itemId: is.item_id,
            item: item ? {
              id: item.id,
              contratoId: item.contrato_id,
              descricao: item.descricao,
              quantidade: 0,
              unidade: item.unidade,
              valorUnitario: item.valor_unitario,
              quantidadeConsumida: 0,
              createdAt: new Date()
            } : undefined,
            quantidade: is.quantidade,
            valorUnitario: item?.valor_unitario || 0,
            valorTotal: (item?.valor_unitario || 0) * is.quantidade
          }]);
        }
      });

      const transformedSolicitacoes: OrdemSolicitacao[] = (solicitacoesData || []).map(solicitacao => ({
        id: solicitacao.id,
        contratoId: solicitacao.contrato_id,
        solicitante: solicitacao.solicitante,
        secretaria: solicitacao.secretaria,
        justificativa: solicitacao.justificativa,
        quantidade: solicitacao.quantidade,
        status: solicitacao.status as any,
        criadoEm: new Date(solicitacao.criado_em),
        decididoPor: solicitacao.decidido_por,
        decididoEm: solicitacao.decidido_em ? new Date(solicitacao.decidido_em) : undefined,
        motivoDecisao: solicitacao.motivo_decisao,
        contrato: solicitacao.contrato ? {
          id: solicitacao.contrato.id,
          numero: solicitacao.contrato.numero,
          fornecedorIds: [solicitacao.contrato.fornecedor_id],
          fundoMunicipal: Array.isArray(solicitacao.contrato.fundo_municipal) ? solicitacao.contrato.fundo_municipal as any : [],
          objeto: solicitacao.contrato.objeto,
          valor: solicitacao.contrato.valor,
          dataInicio: new Date(solicitacao.contrato.data_inicio),
          dataTermino: new Date(solicitacao.contrato.data_termino),
          status: solicitacao.contrato.status as any,
          itens: [],
          createdAt: new Date(),
          fornecedores: solicitacao.contrato.fornecedor ? [{
            id: solicitacao.contrato.fornecedor.id,
            nome: solicitacao.contrato.fornecedor.nome,
            cnpj: solicitacao.contrato.fornecedor.cnpj,
            email: solicitacao.contrato.fornecedor.email || "",
            telefone: solicitacao.contrato.fornecedor.telefone || "",
            endereco: solicitacao.contrato.fornecedor.endereco || "",
            createdAt: new Date()
          }] : []
        } : undefined,
        itens: itensPorSolicitacao.get(solicitacao.id) || [],
        valorTotal: (itensPorSolicitacao.get(solicitacao.id) || []).reduce((total, item) => total + item.valorTotal, 0)
      }));

      setSolicitacoes(transformedSolicitacoes);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar solicitações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSolicitacao = async (solicitacaoData: {
    contratoId: string;
    justificativa?: string;
    quantidade?: number;
    itens: { itemId: string; quantidade: number }[];
  }) => {
    try {
      console.log("🚀 Iniciando criação de solicitação...", solicitacaoData);

      // Calcular quantidade total dos itens
      const quantidadeTotal = solicitacaoData.itens.reduce((total, item) => total + item.quantidade, 0);

      // Montar payload para RPC
      const payload = {
        p_contrato_id: solicitacaoData.contratoId,
        p_justificativa: solicitacaoData.justificativa || "Solicitação criada via sistema",
        p_quantidade: Number(quantidadeTotal),
        p_secretaria: "Prefeitura Municipal", // Secretaria padrão para este hook
      };

      console.log('payload/ordem', payload);

      // Chamar RPC create_solicitacao_ordem
      const { data: result, error } = await supabase.rpc('create_solicitacao_ordem', payload);

      if (error) {
        console.error('Erro ao criar ordem via RPC:', { error, payload });
        throw new Error(error.message || 'Erro ao criar solicitação');
      }

      // Verificar resposta da RPC
      if (!result?.success) {
        console.error('RPC retornou sucesso=false:', result);
        throw new Error(result?.message || 'Não foi possível criar a solicitação');
      }

      const ordemCriada = result;

      console.log("✅ Solicitação criada com sucesso:", ordemCriada.id);

      // Inserir itens da solicitação
      if (solicitacaoData.itens.length > 0) {
        console.log("📦 Inserindo itens da solicitação...", solicitacaoData.itens);
        
        const itensSolicitacao = solicitacaoData.itens.map((item) => ({
          solicitacao_id: ordemCriada.id,
          item_id: item.itemId,
          quantidade: item.quantidade,
        }));

        const { error: itensError } = await supabase
          .from("itens_solicitacao")
          .insert(itensSolicitacao);

        if (itensError) {
          console.error("❌ Erro ao inserir itens:", itensError);
          throw itensError;
        }

        console.log("✅ Itens inseridos com sucesso");
      }

      await fetchSolicitacoes();
      return ordemCriada;
    } catch (error: any) {
      console.error("💥 Erro completo na criação da solicitação:", error);
      
      // Tratamento específico para erros de secretaria
      if (error.message?.includes('P0001') || 
          error.message?.includes('Secretaria não definida') ||
          error.message?.includes('Selecione a secretaria') ||
          error.message?.includes('Escolha uma secretaria')) {
        toast({
          title: "Secretaria não definida",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao criar solicitação",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const aprovarSolicitacao = async (solicitacaoId: string, numero: string, dataEmissao: Date, motivo: string) => {
    try {
      // TODO: Implementar função RPC para aprovar solicitação
      toast({
        title: "Funcionalidade não implementada",
        description: "A função de aprovação ainda não foi implementada",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar solicitação",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const recusarSolicitacao = async (solicitacaoId: string, motivo: string) => {
    try {
      // TODO: Implementar função RPC para recusar solicitação
      toast({
        title: "Funcionalidade não implementada",
        description: "A função de recusa ainda não foi implementada",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao recusar solicitação",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  return {
    solicitacoes,
    loading,
    refetch: fetchSolicitacoes,
    createSolicitacao,
    aprovarSolicitacao,
    recusarSolicitacao,
  };
};
