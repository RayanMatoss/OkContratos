
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import OrdensTable from "@/components/ordens/OrdensTable";
import { OrdemFormDialog } from "@/components/ordens/OrdemFormDialog";
import { useOrdens } from "@/hooks/useOrdens";
import { useToast } from "@/hooks/use-toast";
import { OrdemFornecimento } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const Ordens = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingOrdem, setEditingOrdem] = useState<OrdemFornecimento | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { ordens, loading, refetch } = useOrdens();
  const { toast } = useToast();

  const filteredOrdens = ordens.filter((ordem) => {
    return (
      ordem.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.contrato?.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAdd = () => {
    setFormMode('create');
    setEditingOrdem(undefined);
    setShowForm(true);
  };

  const handleEdit = (ordem: OrdemFornecimento) => {
    if (ordem.status !== "Pendente") {
      toast({
        title: "Não é possível editar",
        description: "Apenas ordens com status 'Pendente' podem ser editadas",
        variant: "destructive"
      });
      return;
    }
    
    setFormMode('edit');
    setEditingOrdem(ordem);
    setShowForm(true);
  };

  const handleDelete = async (ordem: OrdemFornecimento) => {
    try {
      const { error } = await supabase
        .from('ordens')
        .delete()
        .eq('id', ordem.id)
        .eq('status', 'Pendente');

      if (error) throw error;

      await refetch();
      
      toast({
        title: "Ordem excluída",
        description: "A ordem foi excluída com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir ordem",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOrdem(undefined);
    refetch();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ordens de Fornecimento</h1>
          <p className="text-muted-foreground">
            Gerenciamento das ordens de fornecimento e serviço
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nova Ordem</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ordens..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <OrdensTable 
        filteredOrdens={filteredOrdens} 
        loading={loading} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <OrdemFormDialog 
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
        ordem={editingOrdem}
        mode={formMode}
      />
    </div>
  );
};

export default Ordens;
