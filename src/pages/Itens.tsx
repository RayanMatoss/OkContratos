
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ItemFormDialog } from "@/components/itens/ItemFormDialog";
import { ItemsTable } from "@/components/itens/ItemsTable";
import { useItensCrud, ItemResponse } from "@/hooks/itens/useItensCrud";
import { useToast } from "@/hooks/use-toast";
import { Contrato, FundoMunicipal } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const Itens = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemResponse | undefined>();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { itens, loading, fetchItens, handleEdit, handleDelete } = useItensCrud();
  const { toast } = useToast();

  useEffect(() => {
    fetchItens();
  }, []);

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
          const contratosFormatados: Contrato[] = data.map((contrato) => ({
            id: contrato.id,
            numero: contrato.numero,
            fornecedorId: contrato.fornecedor_id,
            fundoMunicipal: Array.isArray(contrato.fundo_municipal) ? contrato.fundo_municipal as FundoMunicipal[] : [],
            objeto: contrato.objeto,
            valor: contrato.valor,
            dataInicio: new Date(contrato.data_inicio),
            dataTermino: new Date(contrato.data_termino),
            status: contrato.status as any,
            createdAt: new Date(contrato.created_at),
            itens: []
          }));
          setContratos(contratosFormatados);
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

  const handleEditItem = (item: ItemResponse) => {
    const editableItem = handleEdit(item);
    if (editableItem) {
      setFormMode('edit');
      setEditingItem(editableItem);
      setShowForm(true);
    }
  };

  const handleDeleteItem = async (item: ItemResponse) => {
    await handleDelete(item);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(undefined);
    fetchItens();
  };

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
        items={filteredItens} 
        loading={loading} 
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />
      
      <ItemFormDialog 
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
        item={editingItem as any}
        mode={formMode}
        contratos={contratos}
      />
    </div>
  );
};

export default Itens;
