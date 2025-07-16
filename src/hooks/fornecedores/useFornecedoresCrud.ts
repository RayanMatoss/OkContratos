import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Fornecedor } from "@/types";

const useFornecedoresCrud = () => {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFornecedores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedFornecedores: Fornecedor[] = data.map(fornecedor => ({
        id: fornecedor.id,
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj,
        email: fornecedor.email || "",
        telefone: fornecedor.telefone || "",
        endereco: fornecedor.endereco || "",
        createdAt: new Date(fornecedor.created_at)
      }));

      setFornecedores(formattedFornecedores);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar fornecedores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

      await fetchFornecedores();
      toast({
        title: "Fornecedor adicionado",
        description: "O fornecedor foi adicionado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar fornecedor",
        description: error.message,
        variant: "destructive",
      });
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

      await fetchFornecedores();
      toast({
        title: "Fornecedor atualizado",
        description: "O fornecedor foi atualizado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar fornecedor",
        description: error.message,
        variant: "destructive",
      });
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

      await fetchFornecedores();
      toast({
        title: "Fornecedor excluído",
        description: "O fornecedor foi excluído com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir fornecedor",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { fornecedores, loading, fetchFornecedores, addFornecedor, updateFornecedor, deleteFornecedor };
};

export default useFornecedoresCrud;
