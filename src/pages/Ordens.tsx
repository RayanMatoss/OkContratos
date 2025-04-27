
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import OrdensTable from "@/components/ordens/OrdensTable";
import { AddOrdemForm } from "@/components/ordens/AddOrdemForm";
import { ordens } from "@/data/mockData";

const Ordens = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredOrdens = ordens.filter((ordem) => {
    return (
      ordem.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.contrato?.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ordens de Fornecimento</h1>
          <p className="text-muted-foreground">
            Gerenciamento das ordens de fornecimento e serviço
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
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

      <OrdensTable filteredOrdens={filteredOrdens} />
      
      {showAddDialog && (
        <AddOrdemForm 
          onCancel={() => setShowAddDialog(false)}
          onSuccess={() => setShowAddDialog(false)}
        />
      )}
    </div>
  );
};

export default Ordens;
