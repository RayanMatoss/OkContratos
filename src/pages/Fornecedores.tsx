
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SearchFornecedores } from "@/components/fornecedores/SearchFornecedores";
import { FornecedorFormDialog } from "@/components/fornecedores/FornecedorFormDialog";
import { FornecedoresTable } from "@/components/fornecedores/FornecedoresTable";
import { useFornecedoresState } from "@/hooks/fornecedores";

const Fornecedores = () => {
  const {
    searchTerm,
    setSearchTerm,
    showDialog,
    setShowDialog,
    loading,
    fornecedorForm,
    filteredFornecedores,
    handleAddFornecedor,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleOpenAdd,
    handleFornecedorChange,
    isEditing,
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
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
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

      <FornecedorFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSubmit={isEditing ? handleUpdate : handleAddFornecedor}
        loading={loading}
        fornecedor={fornecedorForm}
        onFornecedorChange={handleFornecedorChange}
        mode={isEditing ? 'edit' : 'create'}
      />
    </div>
  );
};

export default Fornecedores;
