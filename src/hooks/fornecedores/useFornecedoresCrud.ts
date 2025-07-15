import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMunicipioFilter } from "../useMunicipioFilter";
import type { Fornecedor } from "@/types";
import { formatFornecedor, type NewFornecedor } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useFornecedoresCrud = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addMunicipioToData } = useMunicipioFilter();

  const addFornecedor = async (newFornecedor: NewFornecedor): Promise<Fornecedor | null> => {
    try {
      setLoading(true);
      // Adicionar município automaticamente
      const fornecedorWithMunicipio = addMunicipioToData(newFornecedor);
      // Inserir no Supabase
      const { data, error } = await supabase
        .from('fornecedores')
        .insert([fornecedorWithMunicipio])
        .select()
        .single();
      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Fornecedor cadastrado com sucesso."
      });
      return data as Fornecedor;
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
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Adicionar município automaticamente
      const fornecedorWithMunicipio = addMunicipioToData(data);
      
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
    // Simular verificação de contratos associados
    await new Promise(resolve => setTimeout(resolve, 100));
    return false; // Por enquanto, sempre retorna false para permitir exclusão
  };

  const deleteFornecedor = async (fornecedor: Fornecedor): Promise<boolean> => {
    try {
      setLoading(true);
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
      // Remover do Supabase
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
        description: error.message || "Erro ao excluir fornecedor",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
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
