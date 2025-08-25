import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ContratoFormDialog } from "@/components/contratos/ContratoFormDialog";
import ContratosTable from "@/components/contratos/ContratosTable";
import ContratoDetalhes from "@/components/contratos/ContratoDetalhes";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useContratos } from "@/hooks/useContratos";
import { useToast } from "@/hooks/use-toast";
import { Contrato, FundoMunicipal, StatusContrato } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { parseDatabaseDate } from "@/lib/dateUtils";

function useFixPointerEvents(open: boolean) {
  useEffect(() => {
    if (!open) {
      document.body.style.pointerEvents = "auto";
    }
  }, [open]);
}

const Contratos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingContrato, setEditingContrato] = useState<Contrato | undefined>();
  const [selectedContrato, setSelectedContrato] = useState<Contrato | undefined>();
  const { contratos, loading, error, fetchContratos } = useContratos();
  const { toast } = useToast();

  const filteredContratos = contratos.filter((contrato) => {
    const fornecedoresNomes = contrato.fornecedores?.map(f => f.nome.toLowerCase()).join(' ') || '';
    return (
      contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedoresNomes.includes(searchTerm.toLowerCase())
    );
  });

  const handleEdit = (contrato: Contrato) => {
    if (contrato.status === 'Expirado') {
      toast({
        title: "Edição não permitida",
        description: "Contratos expirados não podem ser editados",
        variant: "destructive"
      });
      return;
    }
    setEditingContrato(contrato);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContrato(undefined);
  };

  const handleDelete = async (contrato: Contrato) => {
    try {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', contrato.id);
      
      if (error) throw error;
      
      toast({
        title: "Contrato excluído",
        description: "O contrato foi excluído com sucesso",
      });
      
      fetchContratos();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir contrato",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleView = (contrato: Contrato) => {
    setSelectedContrato(contrato);
  };

  // Função de sucesso para edição/criação
  const handleSuccess = () => {
    setShowForm(false);
    setEditingContrato(undefined);
    fetchContratos();
  };

  // Função para buscar contrato atualizado
  const fetchContratoById = async (id: string) => {
    const { data, error } = await supabase
      .from("contratos")
      .select(`
        *,
        contrato_fornecedores(
          fornecedor_id,
          fornecedores(
            id,
            nome,
            cnpj,
            email,
            telefone,
            endereco
          )
        ),
        itens(*)
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar contrato:', error);
      return undefined;
    }
    
    // Extrair fornecedores do relacionamento
    const fornecedores = data.contrato_fornecedores?.map((cf: any) => ({
      id: cf.fornecedores.id,
      nome: cf.fornecedores.nome,
      cnpj: cf.fornecedores.cnpj,
      email: cf.fornecedores.email || "",
      telefone: cf.fornecedores.telefone || "",
      endereco: cf.fornecedores.endereco || "",
      createdAt: new Date()
    })) || [];

    const fornecedorIds = fornecedores.map(f => f.id);

    // Extrair itens do contrato
    const itens = data.itens?.map((item: any) => ({
      id: item.id,
      contratoId: id,
      descricao: item.descricao,
      quantidade: item.quantidade,
      unidade: item.unidade,
      valorUnitario: item.valor_unitario,
      quantidadeConsumida: item.quantidade_consumida || 0,
      createdAt: parseDatabaseDate(item.created_at) || new Date(),
      fundos: item.fundos || []
    })) || [];

    return {
      id: data.id,
      numero: data.numero,
      fornecedorIds: fornecedorIds,
      fornecedores: fornecedores,
      fundoMunicipal: Array.isArray(data.fundo_municipal) ? data.fundo_municipal as FundoMunicipal[] : [],
      objeto: data.objeto,
      valor: data.valor,
      dataInicio: parseDatabaseDate(data.data_inicio) || new Date(),
      dataTermino: parseDatabaseDate(data.data_termino) || new Date(),
      status: data.status as StatusContrato,
      createdAt: parseDatabaseDate(data.created_at) || new Date(),
      itens: itens
    };
  };

  useFixPointerEvents(showForm);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gerenciamento dos contratos registrados no sistema
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Novo Contrato</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar contratos..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Status de Conexão */}
        <ConnectionStatus />
      </div>

      {/* Estado de Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando contratos...</p>
          </div>
        </div>
      )}

      {/* Estado de Erro */}
      {error && !loading && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Erro ao carregar contratos
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <div className="flex gap-3">
                <Button 
                  onClick={fetchContratos} 
                  variant="outline"
                  className="border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  Tentar novamente
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Recarregar página
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Contratos - só exibir se não houver erro e não estiver carregando */}
      {!error && !loading && (
        <ContratosTable 
          contratos={filteredContratos} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* Mensagem quando não há contratos */}
      {!error && !loading && contratos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground space-y-2">
            <p className="text-lg">Nenhum contrato encontrado</p>
            <p className="text-sm">Crie seu primeiro contrato clicando no botão "Novo Contrato"</p>
          </div>
        </div>
      )}

      <ContratoFormDialog
        open={showForm}
        onOpenChange={handleCloseForm}
        mode={editingContrato ? 'edit' : 'create'}
        contrato={editingContrato}
        onSuccess={handleSuccess}
      />

      {selectedContrato && (
        <ContratoDetalhes
          contrato={selectedContrato}
          open={!!selectedContrato}
          onOpenChange={async (open) => {
            if (!open) setSelectedContrato(undefined);
            else if (selectedContrato) {
              const atualizado = await fetchContratoById(selectedContrato.id);
              if (atualizado) setSelectedContrato(atualizado);
            }
          }}
          onAditivoCriado={async () => {
            if (selectedContrato) {
              const atualizado = await fetchContratoById(selectedContrato.id);
              if (atualizado) setSelectedContrato(atualizado);
            }
          }}
        />
      )}
    </div>
  );
};

export default Contratos;
