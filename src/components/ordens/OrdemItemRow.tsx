
import { Input } from "@/components/ui/input";
import { Item } from "@/types";

interface OrdemItemRowProps {
  item: Item;
  selectedQuantity: number;
  adjustedAvailable: number;
  onQuantityChange: (itemId: string, quantidade: number) => void;
}

const OrdemItemRow = ({
  item,
  selectedQuantity,
  adjustedAvailable,
  onQuantityChange,
}: OrdemItemRowProps) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-md border-b last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium">{item.descricao}</p>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <p>Total: {item.quantidade} {item.unidade}</p>
          <p>Consumido: {item.quantidadeConsumida} {item.unidade}</p>
          <p>Disponível: {adjustedAvailable} {item.unidade}</p>
        </div>
      </div>
      <div className="w-24">
        <Input
          type="number"
          min={0}
          max={adjustedAvailable}
          value={selectedQuantity || ''}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            if (value <= adjustedAvailable) {
              onQuantityChange(item.id, value);
            }
          }}
          className="text-right"
          placeholder="Qtd"
        />
      </div>
    </div>
  );
};

export default OrdemItemRow;
