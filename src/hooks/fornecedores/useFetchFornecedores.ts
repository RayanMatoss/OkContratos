import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Fornecedor } from "@/types";
import { formatFornecedor } from "./types";

export const useFetchFornecedores = (shouldFetch: boolean = false) => {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("nome");

      if (error) throw error;

      const formattedFornecedores = data.map(formatFornecedor);
      setFornecedores(formattedFornecedores);
    } catch (error: any) {
      console.error("Erro ao buscar fornecedores:", error);
      toast({
        title: "Erro ao carregar fornecedores",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { fornecedores, loading, fetchFornecedores };
};
