
import { useState, useEffect } from "react";
import { useFetchFornecedores } from "./useFetchFornecedores";

export const useFornecedores = (shouldFetchOnMount: boolean = false) => {
  const { fornecedores, loading, fetchFornecedores } = useFetchFornecedores();
  
  useEffect(() => {
    if (shouldFetchOnMount) {
      fetchFornecedores();
    }
  }, [shouldFetchOnMount]);

  return { fornecedores, loading, fetchFornecedores };
};
