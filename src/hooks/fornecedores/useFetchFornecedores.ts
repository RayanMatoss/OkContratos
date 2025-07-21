import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMunicipioFilter } from "../useMunicipioFilter";
import { Fornecedor } from "@/types";

export const useFetchFornecedores = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
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
      // Filtrar pelo município do usuário usando o campo correto
      const filteredFornecedores = filterByMunicipio((data || []) as Fornecedor[], 'municipio_id');
      setFornecedores(filteredFornecedores);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  }, [filterByMunicipio]);

  return { fornecedores, loading, fetchFornecedores };
};
