<<<<<<< HEAD
<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
import { useState, useEffect } from "react";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOrdemNumero = (mode: 'create' | 'edit' = 'create', initialNumero?: string) => {
  const { toast } = useToast();
  const [numero, setNumero] = useState(initialNumero || "");
  const [loadingNumero, setLoadingNumero] = useState(mode === 'create');

  const fetchNextNumero = async () => {
    setLoadingNumero(true);
    try {
      const { data, error } = await supabase
        .rpc('get_next_ordem_numero');

      if (error) throw error;
      setNumero(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao gerar próximo número da ordem",
        variant: "destructive",
      });
    } finally {
      setLoadingNumero(false);
    }
  };

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  // Chamar automaticamente ao abrir o formulário de criação
  useEffect(() => {
    if (mode === 'create') {
      fetchNextNumero();
    }
  }, [mode]);

<<<<<<< HEAD
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  return {
    numero,
    setNumero,
    loadingNumero,
    fetchNextNumero
  };
};
