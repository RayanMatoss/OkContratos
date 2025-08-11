import { Input } from "@/components/ui/input";
import { Item } from "@/types";
import { Progress } from "@/components/ui/progress";

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
  // Calculate percentage of consumption for progress bar
  const totalConsumed = item.quantidadeConsumida / item.quantidade * 100;
  
  return (
    <div className="flex flex-col p-2 rounded-md border-b last:border-0">
      <div className="flex items-center justify-between">
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
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            max={adjustedAvailable}
            value={selectedQuantity || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
              if (value <= adjustedAvailable) {
                onQuantityChange(item.id, value);
              }
            }}
            className="text-right"
            placeholder="Qtd"
          />
        </div>
      </div>
      
      {/* Add progress bar to visualize consumption */}
      <div className="mt-2">
        <Progress value={totalConsumed} className="h-2" />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {totalConsumed.toFixed(0)}% utilizado
        </p>
      </div>
    </div>
  );
};

export default OrdemItemRow;
