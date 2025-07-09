import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMunicipioFilter } from "../useMunicipioFilter";

export const useFetchFornecedores = () => {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { filterByMunicipio } = useMunicipioFilter();

  const fetchFornecedores = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar fornecedores do Supabase
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*");
      if (error) throw error;
      // Filtrar pelo município do usuário (caso necessário)
      const filteredFornecedores = filterByMunicipio(data || []);
      setFornecedores(filteredFornecedores);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  }, [filterByMunicipio]);

  return { fornecedores, loading, fetchFornecedores };
};
