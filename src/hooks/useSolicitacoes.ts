import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { OrdemSolicitacao } from '@/types';

export function useSolicitacoes(status?: 'PENDENTE' | 'APROVADA' | 'RECUSADA' | 'CANCELADA') {
  const [data, setData] = useState<OrdemSolicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q = supabase
      .from('ordem_solicitacoes')
      .select(`
        *,
        contrato:contratos (
          numero,
          fornecedor:fornecedores ( nome )
        )
      `)
      .order('criado_em', { ascending: false });

    if (status) q = q.eq('status', status);

    q.then(({ data, error }) => {
      if (error) setError(error as any);
      else setData((data ?? []) as any);
      setLoading(false);
    });
  }, [status]);

  return { data, loading, error };
}
