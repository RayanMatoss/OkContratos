import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ItemFormDialog } from "@/components/itens/ItemFormDialog";
import ItemsTable from "@/components/itens/ItemsTable";
import { useItens } from "@/hooks/useItens";
import { useToast } from "@/hooks/use-toast";
import { Item, Contrato, FundoMunicipal } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const Itens = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { itens, loading, refetch } = useItens();
  const { toast } = useToast();

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const { data, error } = await supabase
          .from('contratos')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setContratos(data as Contrato[]);
        }
      } catch (error: any) {
        toast({
          title: "Erro ao buscar contratos",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchContratos();
  }, [toast]);

  const filteredItens = itens.filter((item) => {
    return (
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAdd = () => {
    setFormMode('create');
    setEditingItem(undefined);
    setShowForm(true);
  };

  const handleEdit = (item: Item) => {
    setFormMode('edit');
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item: Item) => {
    try {
      const { error } = await supabase
        .from('itens')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      await refetch();
      
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

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(undefined);
    refetch();
  };

  useEffect(() => {
    const fetchItens = async () => {
      try {
        const { data, error } = await supabase
          .from('itens')
          .select(`
            *,
            contratos (
              numero
            )
          `);
  
        if (error) {
          throw new Error(error.message);
        }
  
        if (data) {
          const itensFormatados: Item[] = data.map((item) => ({
            id: item.id,
            contratoId: item.contrato_id,
            descricao: item.descricao,
            quantidade: item.quantidade,
            unidade: item.unidade,
            valorUnitario: item.valor_unitario,
            quantidadeConsumida: item.quantidade_consumida,
            createdAt: new Date(item.created_at),
            fundoMunicipal: Array.isArray(item.fundos) ? item.fundos as FundoMunicipal[] : []
          }));
          // setItens(itensFormatados);
        }
      } catch (error: any) {
        toast({
          title: "Erro ao buscar itens",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchItens();
  }, [toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Itens</h1>
          <p className="text-muted-foreground">
            Gerenciamento dos itens de contrato
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Novo Item</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar itens..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ItemsTable 
        filteredItens={filteredItens} 
        loading={loading} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <ItemFormDialog 
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
        item={editingItem}
        mode={formMode}
      />
    </div>
  );
};

export default Itens;
