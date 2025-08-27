
import { useEffect } from "react";
import { useFetchFornecedores } from "./useFetchFornecedores";

export const useFornecedores = (shouldFetchOnMount: boolean = false) => {
  const { fornecedores, loading, fetchFornecedores } = useFetchFornecedores();
  
  useEffect(() => {
    if (shouldFetchOnMount && fornecedores.length === 0) {
      fetchFornecedores();
    }
  }, [shouldFetchOnMount, fetchFornecedores, fornecedores.length]);

  return { fornecedores, loading, fetchFornecedores };
};
