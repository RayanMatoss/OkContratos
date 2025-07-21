
import { FormSheet } from "@/components/ui/form-sheet";
import { ItemForm } from "./ItemForm";
import { Item } from "@/types";

type ItemFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  item?: Item;
  mode: 'create' | 'edit';
  contratos: { id: string; numero: string; objeto: string }[];
};

export const ItemFormDialog = ({ 
  open, 
  onOpenChange,
  onSuccess, 
  item,
  mode = 'create',
  contratos
}: ItemFormDialogProps) => {
  const title = mode === 'create' ? "Novo Item" : "Editar Item";
  const description = mode === 'create' 
    ? "Preencha os dados para criar um novo item"
    : "Edite os dados deste item";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is handled by ItemForm component
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      title={title}
      description={description}
    >
      <ItemForm 
        contratos={contratos}
        onAdd={(newItem) => {
          // Handle item creation/update
          onOpenChange(false);
          onSuccess?.();
        }}
      />
    </FormSheet>
  );
};
