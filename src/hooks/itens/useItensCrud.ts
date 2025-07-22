
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ItemResponse {
  id: string;
  contrato_id: string;
  created_at: string;
  descricao: string;
  quantidade: number;
  quantidade_consumida: number;
  unidade: string;
  valor_unitario: number;
  contratos?: {
    numero: string;
    objeto: string;
    fornecedores?: {
      nome: string;
    };
  };
}

export const useItensCrud = () => {
  const { toast } = useToast();
  const [itens, setItens] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchItens() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itens')
        .select(`
          *,
          contratos (
            numero,
            objeto,
            fornecedores (
              nome
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItens(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (item: ItemResponse) => {
    if (item.quantidade_consumida > 0) {
      toast({
        title: "Edição não permitida",
        description: "Não é possível editar um item que já foi consumido",
        variant: "destructive"
      });
      return null;
    }
    return item;
  };

  const handleDelete = async (item: ItemResponse) => {
    try {
      if (item.quantidade_consumida > 0) {
        throw new Error("Não é possível excluir um item que já foi consumido");
      }

      const { error } = await supabase
        .from('itens')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      await fetchItens();
      
      toast({
        title: "Item excluído",
        description: "O item foi excluído com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    itens,
    loading,
    fetchItens,
    handleEdit,
    handleDelete
  };
};

export type { ItemResponse };
