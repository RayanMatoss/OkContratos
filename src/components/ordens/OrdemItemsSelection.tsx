import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Item } from "@/types";

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
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantidade: number }[]>(initialSelectedItems);

  // Reset selected items when contract changes in create mode
  useEffect(() => {
    if (mode === 'create') {
      setSelectedItems([]);
      onItemsChange([]);
    }
  }, [selectedContratoId, mode]);

  // Initialize selected items from props
  useEffect(() => {
    if (initialSelectedItems.length > 0) {
      setSelectedItems(initialSelectedItems);
      onItemsChange(initialSelectedItems);
    }
  }, [initialSelectedItems]);

  // When contract items change and we're in edit mode, reapply the selected items
  useEffect(() => {
    if (mode === 'edit' && contratoItens.length > 0 && initialSelectedItems.length > 0) {
      // Ensure all selected items are still valid for this contract
      const validSelectedItems = initialSelectedItems.filter(
        item => contratoItens.some(contractItem => contractItem.id === item.itemId)
      );
      setSelectedItems(validSelectedItems);
      onItemsChange(validSelectedItems);
    }
  }, [contratoItens, mode]);

  const handleQuantityChange = (itemId: string, quantidade: number) => {
    const itemIdx = selectedItems.findIndex((i) => i.itemId === itemId);
    if (itemIdx >= 0) {
      if (quantidade <= 0) {
        // Remove item if quantity is 0 or less
        const newItems = selectedItems.filter((_, idx) => idx !== itemIdx);
        setSelectedItems(newItems);
        onItemsChange(newItems);
      } else {
        // Update quantity
        const newItems = [...selectedItems];
        newItems[itemIdx].quantidade = quantidade;
        setSelectedItems(newItems);
        onItemsChange(newItems);
      }
    } else if (quantidade > 0) {
      // Add new item
      const newItems = [...selectedItems, { itemId, quantidade }];
      setSelectedItems(newItems);
      onItemsChange(newItems);
    }
  };

  // Helper function to get the current quantity for an item
  const getSelectedQuantity = (itemId: string) => {
    const item = selectedItems.find(i => i.itemId === itemId);
    return item ? item.quantidade : 0;
  };

  if (!selectedContratoId) return null;

  return (
    <div className="space-y-2">
      <Label>Itens do Contrato</Label>
      <div className="max-h-[300px] overflow-y-auto space-y-2 rounded-md border p-2">
        {contratoItens.map((item) => {
          const availableQuantity = item.quantidade - item.quantidadeConsumida;
          const selectedQuantity = getSelectedQuantity(item.id);
          
          // In edit mode, add back the current selection to the available amount
          const adjustedAvailable = mode === 'edit' 
            ? availableQuantity + selectedQuantity 
            : availableQuantity;
          
          return (
            <div key={item.id} className="flex items-center justify-between p-2 rounded-md border-b last:border-0">
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
                      handleQuantityChange(item.id, value);
                    }
                  }}
                  className="text-right"
                  placeholder="Qtd"
                />
              </div>
            </div>
          );
        })}
        {contratoItens.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            Nenhum item disponível para este contrato.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdemItemsSelection;
