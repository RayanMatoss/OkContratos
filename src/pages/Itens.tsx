
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ItemsTable } from "@/components/itens/ItemsTable";
import { SearchInput } from "@/components/itens/SearchInput";
import { AddItemsDialog } from "@/components/itens/AddItemsDialog";
import { EditItemDialog } from "@/components/itens/EditItemDialog";
import { ItensHeader } from "@/components/itens/ItensHeader";
import { useItensCrud, ItemResponse } from "@/hooks/itens/useItensCrud";
import { useContratos } from "@/hooks/itens/useContratos";
import { useItensFilter } from "@/hooks/itens/useItensFilter";

const Itens = () => {
  const { toast } = useToast();
  const { itens, loading, fetchItens, handleEdit, handleDelete } = useItensCrud();
  const { contratos } = useContratos();
  const { searchTerm, setSearchTerm, filteredItens } = useItensFilter(itens);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);

  useEffect(() => {
    fetchItens();
  }, []);

  const onEdit = (item: ItemResponse) => {
    const editableItem = handleEdit(item);
    if (editableItem) {
      setEditingItem(editableItem);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ItensHeader onAddItem={() => setShowAddDialog(true)} />

      <div className="flex items-center gap-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>

      <ItemsTable 
        items={filteredItens} 
        loading={loading}
        onEdit={onEdit}
        onDelete={handleDelete}
      />

      <AddItemsDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          setShowAddDialog(false);
          fetchItens();
        }}
        contratos={contratos}
      />

      {editingItem && (
        <EditItemDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onSuccess={fetchItens}
          item={editingItem}
        />
      )}
    </div>
  );
};

export default Itens;
