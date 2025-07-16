
import { FormSheet } from "@/components/ui/form-sheet";
import { ItemForm } from "./ItemForm";
import { Item } from "@/types";

type ItemFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  item?: Item;
  mode: 'create' | 'edit';
};

export const ItemFormDialog = ({ 
  open, 
  onOpenChange,
  onSuccess, 
  item,
  mode = 'create'
}: ItemFormDialogProps) => {
  const title = mode === 'create' ? "Novo Item" : "Editar Item";
  const description = mode === 'create' 
    ? "Preencha os dados para criar um novo item"
    : "Edite os dados deste item";

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <ItemForm 
        item={item}
        mode={mode}
        onSuccess={() => {
          onOpenChange(false);
          onSuccess?.();
        }}
      />
    </FormSheet>
  );
};
