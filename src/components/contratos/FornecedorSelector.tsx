import Select from 'react-select';
import { Fornecedor } from "@/types";

interface FornecedorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  fornecedores: Fornecedor[];
}

const FornecedorSelector = ({ value, onChange, fornecedores }: FornecedorSelectorProps) => {
  const options = fornecedores.map(f => ({ value: f.id, label: f.nome }));
  return (
    <Select
      options={options}
      value={options.find(opt => opt.value === value) || null}
      onChange={selected => onChange(selected ? selected.value : "")}
      placeholder="Selecione os fornecedores"
      className="w-full"
      classNamePrefix="select"
      noOptionsMessage={() => "Nenhum fornecedor disponível"}
    />
  );
};

export default FornecedorSelector;
