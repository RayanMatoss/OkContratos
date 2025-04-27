
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface ItemFormProps {
  onAdd: (item: {
    descricao: string;
    quantidade: string;
    unidade: string;
    valor_unitario: string;
  }) => void;
}

export const ItemForm = ({ onAdd }: ItemFormProps) => {
  const [item, setItem] = useState({
    descricao: "",
    quantidade: "",
    unidade: "",
    valor_unitario: ""
  });

  const handleAdd = () => {
    onAdd(item);
    setItem({
      descricao: "",
      quantidade: "",
      unidade: "",
      valor_unitario: ""
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição do Item</Label>
          <Input
            id="descricao"
            placeholder="Ex: Combustível Gasolina Comum"
            value={item.descricao}
            onChange={(e) => setItem({ ...item, descricao: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              placeholder="Ex: 1000"
              value={item.quantidade}
              onChange={(e) => setItem({ ...item, quantidade: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unidade">Unidade</Label>
            <Input
              id="unidade"
              placeholder="Ex: Litro"
              value={item.unidade}
              onChange={(e) => setItem({ ...item, unidade: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor Unitário</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="Ex: 5.79"
              value={item.valor_unitario}
              onChange={(e) => setItem({ ...item, valor_unitario: e.target.value })}
            />
          </div>
        </div>
      </div>
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Item à Lista
      </Button>
    </div>
  );
};
