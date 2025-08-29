import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AprovarResult =
  | { success: true; message: string; solicitacao_id: string; numero_ordem: string }
  | { success: false; error: string; detail?: string };

export function useAprovarSolicitacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function aprovar(params: {
    solicitacao_id: string;
    aprovador_id: string;
  }): Promise<AprovarResult> {
    setLoading(true);
    setError(null);

    try {
      // Aprovação automática com numeração e data automáticas
      const { data, error } = await supabase.rpc('aprovar_solicitacao_ordem_auto', {
        p_solicitacao_id: params.solicitacao_id,
        p_aprovador_id: params.aprovador_id,
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      // A RPC retorna JSON; mas por segurança, normalize se vier string/linha
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return parsed as AprovarResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido ao aprovar solicitação';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  return { aprovar, loading, error };
}
