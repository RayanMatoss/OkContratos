import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ContratoFormDialog } from "@/components/contratos/ContratoFormDialog";
import ContratosTable from "@/components/contratos/ContratosTable";
import ContratoDetalhes from "@/components/contratos/ContratoDetalhes";
import { useContratos } from "@/hooks/useContratos";
import { useToast } from "@/hooks/use-toast";
import { Contrato, FundoMunicipal, StatusContrato } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
  const { contratos, loading, deleteContrato, fetchContratos, updateContrato } = useContratos();
  const { toast } = useToast();

  const filteredContratos = contratos.filter((contrato) => {
    return (
      contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.fornecedor?.nome.toLowerCase().includes(searchTerm.toLowerCase())
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
    await deleteContrato(contrato.id);
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
      .select(`*, fornecedor:fornecedor_id(id, nome, cnpj, email, telefone, endereco)`)
      .eq("id", id)
      .single();
    if (error) return undefined;
    return {
      id: data.id,
      numero: data.numero,
      fornecedorId: data.fornecedor_id,
      fundoMunicipal: Array.isArray(data.fundo_municipal) ? data.fundo_municipal as FundoMunicipal[] : [],
      objeto: data.objeto,
      valor: data.valor,
      dataInicio: new Date(data.data_inicio),
      dataTermino: new Date(data.data_termino),
      status: data.status as StatusContrato,
      createdAt: new Date(data.created_at),
      fornecedor: data.fornecedor ? {
        id: data.fornecedor.id,
        nome: data.fornecedor.nome,
        cnpj: data.fornecedor.cnpj,
        email: data.fornecedor.email || "",
        telefone: data.fornecedor.telefone || "",
        endereco: data.fornecedor.endereco || "",
        createdAt: new Date()
      } : undefined,
      itens: []
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
      </div>

      <ContratosTable 
        contratos={filteredContratos} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

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
