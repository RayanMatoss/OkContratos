import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type RecusarResult =
  | { success: true; message: string; solicitacao_id: string }
  | { success: false; error: string; detail?: string };

export function useRecusarSolicitacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function recusar(params: {
    solicitacao_id: string;
    recusador_id: string;
    motivo_decisao: string;
  }): Promise<RecusarResult> {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('recusar_solicitacao_ordem', {
        p_solicitacao_id: params.solicitacao_id,
        p_recusador_id: params.recusador_id,
        p_motivo_decisao: params.motivo_decisao,
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      // A RPC retorna JSON; mas por segurança, normalize se vier string/linha
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return parsed as RecusarResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido ao recusar solicitação';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  return { recusar, loading, error };
}
