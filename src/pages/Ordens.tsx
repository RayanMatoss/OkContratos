import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Clock, FileText } from "lucide-react";
import OrdensTable from "@/components/ordens/OrdensTable";
import { OrdemFormDialog } from "@/components/ordens/OrdemFormDialog";
import { SolicitacoesTable } from "@/components/ordens/SolicitacoesTable";
import { useOrdens } from "@/hooks/useOrdens";
import { useSolicitacoes } from "@/hooks/useSolicitacoes";
import { useOrdensAprovadas } from "@/hooks/useOrdensAprovadas";
import { useToast } from "@/hooks/use-toast";
import { OrdemFornecimento } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Ordens = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingOrdem, setEditingOrdem] = useState<OrdemFornecimento | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  // Hooks existentes
  const { ordens, loading, refetch } = useOrdens();
  const { ordens: ordensAprovadas, loading: loadingOrdensAprovadas } = useOrdensAprovadas();
  
  // Hook para solicitações pendentes
  const { data: solicitacoes, loading: loadingSolicitacoes, error: errorSolicitacoes, refetch: refetchSolicitacoes } = useSolicitacoes('PENDENTE');
  
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
    setFormMode('edit');
    setEditingOrdem(ordem);
    setShowForm(true);
  };

  const handleDelete = async (ordem: OrdemFornecimento) => {
    try {
      const { error } = await supabase
        .from('ordens')
        .delete()
        .eq('id', ordem.id);

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
    refetch(); // Recarregar ordens aprovadas
    refetchSolicitacoes(); // Recarregar solicitações pendentes
    
    toast({
      title: "Sucesso!",
      description: "A solicitação foi criada e a lista foi atualizada",
    });
  };

  // Tratar erro das solicitações
  if (errorSolicitacoes) {
    console.error("Erro ao carregar solicitações:", errorSolicitacoes);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordens de Fornecimento</h1>
          <p className="text-muted-foreground">
            Gerencie as ordens de fornecimento e solicitações do sistema
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>

      <Tabs defaultValue="solicitacoes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solicitacoes" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Solicitações
          </TabsTrigger>
          <TabsTrigger value="ordens" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Ordens Aprovadas
          </TabsTrigger>
        </TabsList>

        {/* Aba de Solicitações Pendentes */}
        <TabsContent value="solicitacoes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Solicitações Pendentes</h2>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar solicitações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          {loadingSolicitacoes ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Carregando solicitações...</p>
              </div>
            </div>
          ) : solicitacoes && solicitacoes.length > 0 ? (
            <SolicitacoesTable
              solicitacoes={solicitacoes}
              loading={loadingSolicitacoes}
              onRefresh={refetchSolicitacoes}
            />
          ) : (
            <div className="text-center p-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação pendente</h3>
              <p className="text-muted-foreground">Não há solicitações aguardando aprovação no momento.</p>
            </div>
          )}
        </TabsContent>

        {/* Aba de Ordens Aprovadas (existente) */}
        <TabsContent value="ordens" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Ordens Aprovadas</h2>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ordens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          {loadingOrdensAprovadas ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Carregando ordens...</p>
              </div>
            </div>
          ) : (
            <OrdensTable
              ordens={ordensAprovadas}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loadingOrdensAprovadas}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Formulário */}
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
