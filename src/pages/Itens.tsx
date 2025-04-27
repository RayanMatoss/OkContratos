import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchInput } from "@/components/itens/SearchInput";
import { ItemsTable } from "@/components/itens/ItemsTable";
import { AddItemsDialog } from "@/components/itens/AddItemsDialog";
import { Contrato } from "@/types";

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

const Itens = () => {
  const { toast } = useToast();
  const [itens, setItens] = useState<ItemResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contratos, setContratos] = useState<Contrato[]>([]);

  useEffect(() => {
    fetchItens();
    fetchContratos();
  }, []);

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

  async function fetchContratos() {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('id, numero, objeto')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContratos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  }

  const filteredItens = itens.filter((item) => {
    return (
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.quantidade).includes(searchTerm) ||
      String(item.valor_unitario).includes(searchTerm)
    );
  });

  const handleEdit = (item: ItemResponse) => {
    toast({
      title: "Em breve",
      description: "A edição de itens será implementada em breve",
    });
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Itens</h1>
          <p className="text-muted-foreground">
            Gerenciamento dos itens cadastrados em contratos
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Novo Item</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>

      <ItemsTable 
        items={filteredItens} 
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddItemsDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          setShowAddDialog(false);
          fetchItens();
        }}
        contratos={contratos}
      />
    </div>
  );
};

export default Itens;
