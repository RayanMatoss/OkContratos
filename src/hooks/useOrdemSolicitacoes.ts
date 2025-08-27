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
      
      // Obter informações do usuário logado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("❌ Erro ao obter usuário:", authError);
        throw new Error("Erro de autenticação: " + authError.message);
      }
      
      if (!user) {
        console.error("❌ Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("✅ Usuário autenticado:", user.id);

      // Buscar informações do usuário incluindo fundo municipal
      const { data: userProfile, error: userError } = await supabase
        .from("user_profiles")
        .select("id, fundo_municipal")
        .eq("user_id", user.id)
        .single();

      if (userError) {
        console.error("❌ Erro ao buscar perfil do usuário:", userError);
        throw new Error("Erro ao buscar perfil do usuário: " + userError.message);
      }

      console.log("✅ Perfil do usuário encontrado:", userProfile);

      if (!userProfile?.fundo_municipal || userProfile.fundo_municipal.length === 0) {
        console.error("❌ Fundo municipal não definido para o usuário");
        throw new Error("Fundo municipal não definido para o usuário");
      }

      // Usar o primeiro fundo municipal como secretaria
      const secretaria = userProfile.fundo_municipal[0];
      console.log("✅ Secretaria definida:", secretaria);

      // Verificar se a tabela existe e tem a estrutura correta
      const { data: tableInfo, error: tableError } = await supabase
        .from("ordem_solicitacoes")
        .select("id")
        .limit(1);

      if (tableError) {
        console.error("❌ Erro ao verificar tabela:", tableError);
        throw new Error("Erro ao verificar tabela: " + tableError.message);
      }

      console.log("✅ Tabela verificada com sucesso");

      // Preparar dados para inserção
      const dadosSolicitacao = {
        contrato_id: solicitacaoData.contratoId,
        solicitante: user.id,
        secretaria: secretaria,
        justificativa: solicitacaoData.justificativa || "Solicitação criada via sistema",
        quantidade: solicitacaoData.quantidade || 0,
        status: "PENDENTE"
      };

      console.log("📝 Dados para inserção:", dadosSolicitacao);

      // Tentar inserir usando RPC para contornar possíveis problemas de RLS
      const { data: solicitacao, error: solicitacaoError } = await supabase
        .rpc('create_solicitacao_ordem', {
          p_contrato_id: dadosSolicitacao.contrato_id,
          p_solicitante: dadosSolicitacao.solicitante,
          p_secretaria: dadosSolicitacao.secretaria,
          p_justificativa: dadosSolicitacao.justificativa,
          p_quantidade: dadosSolicitacao.quantidade,
          p_status: dadosSolicitacao.status
        });

      if (solicitacaoError) {
        console.error("❌ Erro ao criar solicitação via RPC:", solicitacaoError);
        
        // Fallback: tentar inserção direta
        console.log("🔄 Tentando inserção direta...");
        
        const { data: solicitacaoDirect, error: solicitacaoDirectError } = await supabase
          .from("ordem_solicitacoes")
          .insert(dadosSolicitacao)
          .select("id")
          .single();

        if (solicitacaoDirectError) {
          console.error("❌ Erro na inserção direta:", solicitacaoDirectError);
          throw solicitacaoDirectError;
        }

        console.log("✅ Solicitação criada via inserção direta:", solicitacaoDirect.id);
        await fetchSolicitacoes();
        return solicitacaoDirect;
      }

      console.log("✅ Solicitação criada via RPC:", solicitacao);

      // Inserir itens da solicitação
      if (solicitacaoData.itens.length > 0) {
        console.log("📦 Inserindo itens da solicitação...", solicitacaoData.itens);
        
        const itensSolicitacao = solicitacaoData.itens.map((item) => ({
          solicitacao_id: solicitacao.id,
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
      return solicitacao;
    } catch (error: any) {
      console.error("💥 Erro completo na criação da solicitação:", error);
      
      toast({
        title: "Erro ao criar solicitação",
        description: error.message,
        variant: "destructive",
      });
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
