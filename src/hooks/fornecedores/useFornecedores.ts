
import { useEffect } from "react";
import { useFetchFornecedores } from "./useFetchFornecedores";

export const useFornecedores = (shouldFetchOnMount: boolean = false) => {
  const { fornecedores, loading, fetchFornecedores } = useFetchFornecedores();
  
  useEffect(() => {
<<<<<<< HEAD
    if (shouldFetchOnMount && fornecedores.length === 0) {
      fetchFornecedores();
    }
  }, [shouldFetchOnMount, fetchFornecedores, fornecedores.length]);
=======
    if (shouldFetchOnMount) {
      fetchFornecedores();
    }
  }, [shouldFetchOnMount, fetchFornecedores]);
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654

  return { fornecedores, loading, fetchFornecedores };
};
