<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
<<<<<<< HEAD
<<<<<<< HEAD
import Select from 'react-select';
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
import Select from 'react-select';
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

interface NewItem {
  descricao: string;
  quantidade: string;
  unidade: string;
  valor_unitario: string;
<<<<<<< HEAD
<<<<<<< HEAD
  contrato_id: string;
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
  contrato_id: string;
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
}

interface ItemFormProps {
  onAdd: (item: NewItem) => void;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  contratos: { id: string; numero: string; objeto: string }[];
}

export const ItemForm = ({ onAdd, contratos }: ItemFormProps) => {
<<<<<<< HEAD
=======
}

export const ItemForm = ({ onAdd }: ItemFormProps) => {
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  const [item, setItem] = useState<NewItem>({
    descricao: "",
    quantidade: "",
    unidade: "",
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    valor_unitario: "",
    contrato_id: ""
  });

  const handleAdd = () => {
    if (!item.contrato_id) return;
<<<<<<< HEAD
=======
    valor_unitario: ""
  });

  const handleAdd = () => {
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    onAdd(item);
    setItem({
      descricao: "",
      quantidade: "",
      unidade: "",
<<<<<<< HEAD
<<<<<<< HEAD
      valor_unitario: "",
      contrato_id: ""
=======
      valor_unitario: ""
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
      valor_unitario: "",
      contrato_id: ""
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        <div className="space-y-2">
          <Label htmlFor="contrato">Contrato</Label>
          <Select
            inputId="contrato"
            classNamePrefix="select"
            className="w-full"
            isSearchable
            isClearable
            placeholder="Selecione o contrato"
            value={
              contratos
                .map((contrato) => ({
                  value: contrato.id,
                  label: `${contrato.numero} - ${contrato.objeto}`,
                }))
                .find((opt) => opt.value === item.contrato_id) || null
            }
            onChange={(selected) => setItem({ ...item, contrato_id: selected ? selected.value : '' })}
            options={contratos.map((contrato) => ({
              value: contrato.id,
              label: `${contrato.numero} - ${contrato.objeto}`,
            }))}
            noOptionsMessage={() => 'Nenhum contrato encontrado'}
            styles={{
              option: (provided) => ({
                ...provided,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
            }}
          />
        </div>
<<<<<<< HEAD
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
      </div>
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAdd}
        className="w-full"
<<<<<<< HEAD
<<<<<<< HEAD
        disabled={!item.contrato_id}
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
        disabled={!item.contrato_id}
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Item à Lista
      </Button>
    </div>
  );
};
