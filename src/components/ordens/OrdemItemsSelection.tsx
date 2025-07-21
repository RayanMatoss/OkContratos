
import { Label } from "@/components/ui/label";
import { Item } from "@/types";
import OrdemItemsList from "./OrdemItemsList";

interface OrdemItemsSelectionProps {
  selectedContratoId: string;
  contratoItens: Item[];
  onItemsChange: (items: { itemId: string; quantidade: number }[]) => void;
  initialSelectedItems?: { itemId: string; quantidade: number }[];
  mode?: 'create' | 'edit';
}

const OrdemItemsSelection = ({
  selectedContratoId,
  contratoItens,
  onItemsChange,
  initialSelectedItems = [],
  mode = 'create'
}: OrdemItemsSelectionProps) => {
  const handleQuantityChange = (itemId: string, quantidade: number) => {
    const currentItems = initialSelectedItems;
    const itemIdx = currentItems.findIndex((i) => i.itemId === itemId);
    
    let newItems;
    if (itemIdx >= 0) {
      if (quantidade <= 0) {
        newItems = currentItems.filter((_, idx) => idx !== itemIdx);
      } else {
        newItems = [...currentItems];
        newItems[itemIdx].quantidade = quantidade;
      }
    } else if (quantidade > 0) {
      newItems = [...currentItems, { itemId, quantidade }];
    } else {
      newItems = currentItems;
    }
    
    onItemsChange(newItems);
  };

  if (!selectedContratoId) return null;

  return (
    <div className="space-y-2">
      <Label>Itens do Contrato</Label>
      <OrdemItemsList
        contratoItens={contratoItens}
        selectedItems={initialSelectedItems}
        mode={mode}
        onQuantityChange={handleQuantityChange}
      />
    </div>
  );
};

export default OrdemItemsSelection;
