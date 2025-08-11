<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
      // Filtrar pelo município do usuário usando o campo correto
      const filteredFornecedores = filterByMunicipio(data || [], 'municipio_id');
      setFornecedores(filteredFornecedores);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  }, [filterByMunicipio]);
<<<<<<< HEAD
=======

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
      toast({
        title: "Erro ao carregar fornecedores",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

  return { fornecedores, loading, fetchFornecedores };
};
