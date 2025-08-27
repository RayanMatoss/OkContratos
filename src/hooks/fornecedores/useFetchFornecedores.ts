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
      
      
      
      // Temporariamente, usar todos os fornecedores sem filtro
      setFornecedores(data || []);
      
      // TODO: Reativar filtro de município quando corrigir
      // const filteredFornecedores = filterByMunicipio(data || [], 'municipio_id');
      // setFornecedores(filteredFornecedores);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fornecedores, loading, fetchFornecedores };
};
