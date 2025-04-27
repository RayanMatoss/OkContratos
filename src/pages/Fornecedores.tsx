import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SearchFornecedores } from "@/components/fornecedores/SearchFornecedores";
import { AddFornecedorDialog } from "@/components/fornecedores/AddFornecedorDialog";
import { FornecedoresTable } from "@/components/fornecedores/FornecedoresTable";
import { useFornecedoresState } from "@/hooks/useFornecedores";

const Fornecedores = () => {
  const {
    searchTerm,
    setSearchTerm,
    showAddDialog,
    setShowAddDialog,
    loading,
    newFornecedor,
    filteredFornecedores,
    handleAddFornecedor,
    handleEdit,
    handleDelete,
    handleFornecedorChange,
    fetchFornecedores
  } = useFornecedoresState();

  useEffect(() => {
    fetchFornecedores();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerenciamento dos fornecedores cadastrados
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Novo Fornecedor</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchFornecedores 
          searchTerm={searchTerm} 
          onSearch={setSearchTerm} 
        />
      </div>

      <FornecedoresTable 
        fornecedores={filteredFornecedores}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddFornecedorDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddFornecedor}
        loading={loading}
        fornecedor={newFornecedor}
        onFornecedorChange={handleFornecedorChange}
      />
    </div>
  );
};

export default Fornecedores;
