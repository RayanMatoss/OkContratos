
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Fornecedor } from "@/types";
import { formatFornecedor, type NewFornecedor } from "./types";

export const useFornecedoresCrud = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addFornecedor = async (newFornecedor: NewFornecedor): Promise<Fornecedor | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fornecedores')
        .insert([newFornecedor])
        .select()
        .single();

      if (error) throw error;

      const formattedFornecedor = formatFornecedor(data);
      
      toast({
        title: "Sucesso",
        description: "Fornecedor cadastrado com sucesso."
      });

      return formattedFornecedor;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFornecedor = async (fornecedor: Fornecedor): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('fornecedores')
        .delete()
        .eq('id', fornecedor.id);

      if (error) throw error;
      
      toast({
        title: "Fornecedor excluído",
        description: "O fornecedor foi excluído com sucesso",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao excluir fornecedor",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    loading,
    addFornecedor,
    deleteFornecedor
  };
};
