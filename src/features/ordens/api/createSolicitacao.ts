import { supabase } from '@/integrations/supabase/client';

type NovaSolicitacao = {
  contrato_id: string;
  justificativa: string;
  quantidade: number;
  secretaria: string; // sempre enviar como string
};

export async function criarOrdem(data: NovaSolicitacao) {
  // Montar payload para RPC com parâmetros nomeados
  const payload = {
    p_contrato_id: data.contrato_id,
    p_justificativa: data.justificativa,
    p_quantidade: Number(data.quantidade), // garantir que seja Number
    p_secretaria: data.secretaria, // sempre enviar
  };

  console.log('payload/ordem', payload);

  // Usar RPC em vez de inserção direta
  const { data: result, error } = await supabase.rpc('create_solicitacao_ordem', payload);

  if (error) {
    console.error('Erro ao criar ordem via RPC:', { error, payload });
    // Erro do trigger (ex.: P0001) ou RLS
    if (error.message?.includes('P0001') || /Secretaria não definida/i.test(error.message)) {
      throw new Error('Selecione a secretaria para prosseguir.');
    }
    throw error;
  }

  // A RPC retorna { success: boolean, id?: string, message?: string }
  if (!result?.success) {
    console.error('RPC retornou sucesso=false:', result);
    throw new Error(result?.message || 'Não foi possível criar a solicitação');
  }

  return result; // Retorna { success: true, id, message }
}

// Função auxiliar para obter secretaria do usuário
export async function obterSecretariaUsuario(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }

    const { data: perfil } = await supabase
      .from('user_profiles')
      .select('fundo_municipal')
      .eq('user_id', user.id)
      .single();

    if (perfil?.fundo_municipal && perfil.fundo_municipal.length === 1) {
      return perfil.fundo_municipal[0];
    }

    return null;
  } catch (error) {
    console.error('Erro ao obter secretaria do usuário:', error);
    return null;
  }
}
