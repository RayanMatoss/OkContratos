
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Item } from "@/types";

interface OrdemItemsSelectionProps {
  selectedContratoId: string;
  contratoItens: Item[];
  onItemsChange: (items: { itemId: string; quantidade: number }[]) => void;
}

const OrdemItemsSelection = ({
  selectedContratoId,
  contratoItens,
  onItemsChange,
}: OrdemItemsSelectionProps) => {
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantidade: number }[]>([]);

  const handleQuantityChange = (itemId: string, quantidade: number) => {
    const itemIdx = selectedItems.findIndex((i) => i.itemId === itemId);
    if (itemIdx >= 0) {
      const newItems = [...selectedItems];
      newItems[itemIdx].quantidade = quantidade;
      setSelectedItems(newItems);
      onItemsChange(newItems);
    } else {
      const newItems = [...selectedItems, { itemId, quantidade }];
      setSelectedItems(newItems);
      onItemsChange(newItems);
    }
  };

  if (!selectedContratoId) return null;

  return (
    <div className="space-y-2">
      <Label>Itens do Contrato</Label>
      <div className="max-h-[200px] overflow-y-auto space-y-2 rounded-md border p-2">
        {contratoItens.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{item.descricao}</p>
              <p className="text-xs text-muted-foreground">
                Disponível: {item.quantidade - item.quantidadeConsumida} {item.unidade}
              </p>
            </div>
            <div className="w-20">
              <Input
                type="number"
                min={0}
                max={item.quantidade - item.quantidadeConsumida}
                placeholder="Qtd"
                onChange={(e) => {
                  handleQuantityChange(item.id, parseInt(e.target.value) || 0);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdemItemsSelection;
