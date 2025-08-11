
import { useEffect } from "react";
import { useFetchFornecedores } from "./useFetchFornecedores";

export const useFornecedores = (shouldFetchOnMount: boolean = false) => {
  const { fornecedores, loading, fetchFornecedores } = useFetchFornecedores();
  
  useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    if (shouldFetchOnMount && fornecedores.length === 0) {
      fetchFornecedores();
    }
  }, [shouldFetchOnMount, fetchFornecedores, fornecedores.length]);
<<<<<<< HEAD
=======
    if (shouldFetchOnMount) {
      fetchFornecedores();
    }
  }, [shouldFetchOnMount, fetchFornecedores]);
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

  return { fornecedores, loading, fetchFornecedores };
};
