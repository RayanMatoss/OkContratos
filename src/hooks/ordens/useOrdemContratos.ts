
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOrdemContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<any[]>([]);

  useEffect(() => {
    fetchContratos();
  }, []);

  const fetchContratos = async () => {
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
  };

  return {
    contratos,
    fetchContratos
  };
};
