
import { Item } from "@/types";
import OrdemItemRow from "./OrdemItemRow";

interface OrdemItemsListProps {
  contratoItens: Item[];
  selectedItems: { itemId: string; quantidade: number }[];
  mode: 'create' | 'edit';
  onQuantityChange: (itemId: string, quantidade: number) => void;
}

const OrdemItemsList = ({
  contratoItens,
  selectedItems,
  mode,
  onQuantityChange,
}: OrdemItemsListProps) => {
  const getSelectedQuantity = (itemId: string) => {
    const item = selectedItems.find(i => i.itemId === itemId);
    return item ? item.quantidade : 0;
  };

  return (
    <div className="max-h-[300px] overflow-y-auto space-y-2 rounded-md border p-2">
      {contratoItens.map((item) => {
        const selectedQuantity = getSelectedQuantity(item.id);
        const adjustedAvailable = mode === 'edit'
          ? item.quantidade - item.quantidadeConsumida + selectedQuantity
          : item.quantidade - item.quantidadeConsumida;

        return (
          <OrdemItemRow
            key={item.id}
            item={item}
            selectedQuantity={selectedQuantity}
            adjustedAvailable={adjustedAvailable}
            onQuantityChange={onQuantityChange}
          />
        );
      })}
      {contratoItens.length === 0 && (
        <div className="p-4 text-center text-muted-foreground">
          Nenhum item disponível para este contrato.
        </div>
      )}
    </div>
  );
};

export default OrdemItemsList;
