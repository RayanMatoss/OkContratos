import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type RpcResult =
  | { id: string; success: true; message?: string }
  | { success: false; error: string; detail?: string };

export function useCriarSolicitacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function criar(params: {
    contrato_id: string;
    solicitante: string; // user.id
    secretaria: string;  // ex: primeira do profile/fundo_municipal
    justificativa?: string;
    quantidade?: number;
  }): Promise<RpcResult> {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.rpc('create_solicitacao_ordem', {
      p_contrato_id: params.contrato_id,
      p_solicitante: params.solicitante,
      p_secretaria: params.secretaria,
      p_justificativa: params.justificativa ?? null,
      p_quantidade: params.quantidade ?? null,
      p_status: 'PENDENTE'
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }

    // A RPC retorna JSON; mas por segurança, normalize se vier string/linha
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    return parsed as RpcResult;
  }

  return { criar, loading, error };
}
