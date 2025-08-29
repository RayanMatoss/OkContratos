import { supabase } from '@/integrations/supabase/client';

// Tipos para as RPCs
export interface SolicitacaoCreateInput {
  contratoId: string;
  justificativa?: string;
  quantidade?: number;
  secretaria?: string; // Opcional: apenas se admin quiser especificar
}

export interface SolicitacaoItemInput {
  item_id: string;
  quantidade: number;
}

export interface RpcResult {
  success: boolean;
  id?: string;
  secretaria?: string;
  message?: string;
  error?: string;
}

// Helper para criar solicitação
export async function rpcCreateSolicitacao(params: SolicitacaoCreateInput): Promise<RpcResult> {
  try {
    // Verificar se o usuário está logado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      };
    }

    // Montar parâmetros da RPC
    const rpcParams: any = {
      p_contrato_id: params.contratoId,
      p_justificativa: params.justificativa ?? null,
      p_quantidade: params.quantidade ?? null,
    };

    // Adicionar secretaria apenas se especificada (para admin)
    if (params.secretaria) {
      rpcParams.p_secretaria = params.secretaria;
    }

    const { data, error } = await supabase.rpc('create_solicitacao_ordem', rpcParams);

    if (error) {
      console.error('Erro na RPC create_solicitacao_ordem:', error);
      return {
        success: false,
        error: error.message || 'Erro interno do servidor'
      };
    }

    // Validar resposta da RPC
    if (!data) {
      return {
        success: false,
        error: 'Resposta vazia da RPC'
      };
    }

    // Se a RPC retornou string, tentar fazer parse
    const result = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Erro ao criar solicitação'
      };
    }

    return {
      success: true,
      id: result.id,
      secretaria: result.secretaria,
      message: result.message || 'Solicitação criada com sucesso'
    };

  } catch (error) {
    console.error('Erro ao executar RPC create_solicitacao_ordem:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// Helper para adicionar itens à solicitação
export async function rpcAddItensSolicitacao(params: {
  solicitacaoId: string;
  itens: SolicitacaoItemInput[];
}): Promise<RpcResult> {
  try {
    const { data, error } = await supabase.rpc('add_itens_solicitacao', {
      p_solicitacao_id: params.solicitacaoId,
      p_itens: params.itens, // O client serializa automaticamente para jsonb
    });

    if (error) {
      console.error('Erro na RPC add_itens_solicitacao:', error);
      return {
        success: false,
        error: error.message || 'Erro interno do servidor'
      };
    }

    // Validar resposta da RPC
    if (!data) {
      return {
        success: false,
        error: 'Resposta vazia da RPC'
      };
    }

    // Se a RPC retornou string, tentar fazer parse
    const result = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Erro ao adicionar itens'
      };
    }

    return {
      success: true,
      message: result.message || 'Itens adicionados com sucesso'
    };

  } catch (error) {
    console.error('Erro ao executar RPC add_itens_solicitacao:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}
