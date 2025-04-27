
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { AddContratoForm } from "@/components/contratos/AddContratoForm";
import ContratosTable from "@/components/contratos/ContratosTable";
import { useContratos } from "@/hooks/useContratos";
import { useToast } from "@/hooks/use-toast";
import { Contrato } from "@/types";

const Contratos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { contratos, loading, deleteContrato } = useContratos();
  const { toast } = useToast();

  const filteredContratos = contratos.filter((contrato) => {
    return (
      contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.fornecedor?.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleEdit = (contrato: Contrato) => {
    toast({
      title: "Em breve",
      description: "A edição de contratos será implementada em breve",
    });
  };

  const handleDelete = async (contrato: Contrato) => {
    await deleteContrato(contrato.id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gerenciamento dos contratos registrados no sistema
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
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
      />

      <AddContratoForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSuccess={() => setShowAddForm(false)}
      />
    </div>
  );
};

export default Contratos;
