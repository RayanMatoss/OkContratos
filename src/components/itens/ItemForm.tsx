import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface NewItem {
  descricao: string;
  quantidade: string;
  unidade: string;
  valor_unitario: string;
  contrato_id: string;
}

interface ItemFormProps {
  onAdd: (item: NewItem) => void;
  contratos: { id: string; numero: string; objeto: string }[];
}

export const ItemForm = ({ onAdd, contratos }: ItemFormProps) => {
  const [item, setItem] = useState<NewItem>({
    descricao: "",
    quantidade: "",
    unidade: "",
    valor_unitario: "",
    contrato_id: ""
  });

  const handleAdd = () => {
    if (!item.contrato_id) return;
    onAdd(item);
    setItem({
      descricao: "",
      quantidade: "",
      unidade: "",
      valor_unitario: "",
      contrato_id: ""
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
        <div className="space-y-2">
          <Label htmlFor="contrato">Contrato</Label>
          <select
            id="contrato"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={item.contrato_id}
            onChange={e => setItem({ ...item, contrato_id: e.target.value })}
            required
          >
            <option value="">Selecione o contrato</option>
            {contratos.map(contrato => (
              <option key={contrato.id} value={contrato.id}>
                {contrato.numero} - {contrato.objeto}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAdd}
        className="w-full"
        disabled={!item.contrato_id}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Item à Lista
      </Button>
    </div>
  );
};
