
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrdemContrato {
  id: string;
  numero: string;
  objeto: string;
  fornecedor_id: string;
  fornecedores?: { nome: string };
}

export const useOrdemContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<OrdemContrato[]>([]);

  useEffect(() => {
    fetchContratos();
  }, [fetchContratos]);

  const fetchContratos = useCallback(async () => {
    const { data, error } = await supabase
      .from("contratos")
      .select("id, numero, objeto, fornecedor_id, fornecedores(nome)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar contratos",
        variant: "destructive",
      });
      return;
    }

    setContratos(data || []);
  }, [toast]);

  return {
    contratos,
    fetchContratos
  };
};
