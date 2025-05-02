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

  const updateFornecedor = async (id: string, data: Omit<NewFornecedor, "id">): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('fornecedores')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Fornecedor atualizado com sucesso."
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const hasAssociatedContracts = async (fornecedorId: string): Promise<boolean> => {
    const { count, error } = await supabase
      .from('contratos')
      .select('*', { count: 'exact', head: true })
      .eq('fornecedor_id', fornecedorId);
    
    if (error) {
      console.error('Error checking contracts:', error);
      return false;
    }

    return (count || 0) > 0;
  };

  const deleteFornecedor = async (fornecedor: Fornecedor): Promise<boolean> => {
    try {
      // Check for associated contracts first
      const hasContracts = await hasAssociatedContracts(fornecedor.id);
      
      if (hasContracts) {
        toast({
          title: "Não é possível excluir o fornecedor",
          description: "Este fornecedor possui contratos associados. Exclua ou reatribua os contratos antes de excluir o fornecedor.",
          variant: "destructive",
        });
        return false;
      }

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
      let errorMessage = "Erro ao excluir fornecedor";
      
      // Check for foreign key constraint violation
      if (error.code === '23503') {
        errorMessage = "Este fornecedor possui contratos associados e não pode ser excluído. Por favor, exclua ou reatribua os contratos primeiro.";
      }
      
      toast({
        title: "Erro ao excluir fornecedor",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    loading,
    addFornecedor,
    deleteFornecedor,
    updateFornecedor,
    hasAssociatedContracts
  };
};
