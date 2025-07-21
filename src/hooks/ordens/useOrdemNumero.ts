import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOrdemNumero = (mode: 'create' | 'edit' = 'create', initialNumero?: string) => {
  const { toast } = useToast();
  const [numero, setNumero] = useState(initialNumero || "");
  const [loadingNumero, setLoadingNumero] = useState(mode === 'create');

  const fetchNextNumero = useCallback(async () => {
    setLoadingNumero(true);
    try {
      const { data, error } = await supabase
        .rpc('get_next_ordem_numero');

      if (error) throw error;
      setNumero(data);
    } catch (error: unknown) {
      let message = 'Erro desconhecido';
      if (error instanceof Error) message = error.message;
      toast({
        title: "Erro",
        description: "Erro ao gerar próximo número da ordem" + (message ? `: ${message}` : ''),
        variant: "destructive",
      });
    } finally {
      setLoadingNumero(false);
    }
  }, [toast]);

  // Chamar automaticamente ao abrir o formulário de criação
  useEffect(() => {
    if (mode === 'create') {
      fetchNextNumero();
    }
  }, [mode, fetchNextNumero]);

  return {
    numero,
    setNumero,
    loadingNumero,
    fetchNextNumero
  };
};
