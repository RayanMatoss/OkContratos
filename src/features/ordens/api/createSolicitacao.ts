import { supabase } from '@/integrations/supabase/client';

export async function createSolicitacao(params: {
  contratoId: string;
  justificativa?: string;
  quantidade?: number;
  secretaria?: string | null;
}) {
  const payload = {
    p_contrato_id: params.contratoId,
    p_justificativa: params.justificativa?.trim() ?? '',
    p_quantidade: Number.isFinite(params.quantidade) ? (params.quantidade as number) : 0,
    p_secretaria: params.secretaria?.trim() ?? ''
  };

  const { data, error } = await supabase.rpc('create_solicitacao_ordem', payload);

  if (error) throw new Error(error.message);
  if (data && data.success === false) throw new Error(data.error ?? 'Falha ao criar solicitação');

  return data; // { success: true, id: <uuid> }
}
