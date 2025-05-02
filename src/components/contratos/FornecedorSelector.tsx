
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fornecedor } from "@/types";

interface FornecedorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  fornecedores: Fornecedor[];
}

const FornecedorSelector = ({ value, onChange, fornecedores }: FornecedorSelectorProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione o fornecedor" />
      </SelectTrigger>
      <SelectContent>
        {fornecedores?.map((fornecedor) => (
          <SelectItem key={fornecedor.id} value={fornecedor.id}>
            {fornecedor.nome}
          </SelectItem>
        )) || <SelectItem value="">Carregando...</SelectItem>}
      </SelectContent>
    </Select>
  );
};

export default FornecedorSelector;
