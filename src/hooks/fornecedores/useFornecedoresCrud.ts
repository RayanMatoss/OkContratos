import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Fornecedor } from "@/types";

export const useFornecedoresCrud = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const addFornecedor = async (fornecedor: Omit<Fornecedor, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('fornecedores')
        .insert({
          nome: fornecedor.nome,
          cnpj: fornecedor.cnpj,
          email: fornecedor.email,
          telefone: fornecedor.telefone,
          endereco: fornecedor.endereco,
        });

      if (error) throw error;

      toast({
        title: "Fornecedor adicionado",
        description: "O fornecedor foi adicionado com sucesso",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar fornecedor",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFornecedor = async (id: string, fornecedor: Omit<Fornecedor, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('fornecedores')
        .update({
          nome: fornecedor.nome,
          cnpj: fornecedor.cnpj,
          email: fornecedor.email,
          telefone: fornecedor.telefone,
          endereco: fornecedor.endereco,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Fornecedor atualizado",
        description: "O fornecedor foi atualizado com sucesso",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar fornecedor",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFornecedor = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('fornecedores')
        .delete()
        .eq('id', id);

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
    } finally {
      setLoading(false);
    }
  };

  const getFornecedor = async (id: string): Promise<Fornecedor | null> => {
    try {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        nome: data.nome,
        cnpj: data.cnpj,
        email: data.email || "",
        telefone: data.telefone || "",
        endereco: data.endereco || "",
        createdAt: new Date(data.created_at)
      };
    } catch (error: any) {
      console.error('Erro ao buscar fornecedor:', error);
      return null;
    }
  };

  const searchFornecedores = async (query: string): Promise<Fornecedor[]> => {
    try {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .or(`nome.ilike.%${query}%,cnpj.ilike.%${query}%`)
        .order('nome');

      if (error) throw error;

      return (data || []).map(fornecedor => ({
        id: fornecedor.id,
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj,
        email: fornecedor.email || "",
        telefone: fornecedor.telefone || "",
        endereco: fornecedor.endereco || "",
        createdAt: new Date(fornecedor.created_at)
      }));
    } catch (error: any) {
      console.error('Erro ao buscar fornecedores:', error);
      return [];
    }
  };

  return {
    loading,
    addFornecedor,
    updateFornecedor,
    deleteFornecedor,
    getFornecedor,
    searchFornecedores
  };
};
