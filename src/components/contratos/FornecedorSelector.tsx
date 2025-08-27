import Select from 'react-select';
import { Fornecedor } from "@/types";

interface FornecedorSelectorProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  fornecedores: Fornecedor[];
  isMulti?: boolean;
}

const FornecedorSelector = ({ value, onChange, fornecedores, isMulti = true }: FornecedorSelectorProps) => {
  const options = fornecedores.map(f => ({ value: f.id, label: f.nome }));
  
  const getValue = () => {
    if (isMulti) {
      const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
      return options.filter(opt => selectedValues.includes(opt.value));
    } else {
      const singleValue = Array.isArray(value) ? value[0] || '' : value;
      return options.find(opt => opt.value === singleValue) || null;
    }
  };

  const handleChange = (selected: any) => {
    if (isMulti) {
      const selectedValues = selected ? selected.map((item: any) => item.value) : [];
      onChange(selectedValues);
    } else {
      onChange(selected ? selected.value : '');
    }
  };

  return (
    <Select
      options={options}
      value={getValue()}
      onChange={handleChange}
      isMulti={isMulti}
      placeholder={isMulti ? "Selecione os fornecedores" : "Selecione o fornecedor"}
      className="w-full"
      classNamePrefix="select"
      noOptionsMessage={() => "Nenhum fornecedor disponível"}
      closeMenuOnSelect={!isMulti}
      theme={theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: 'hsl(217.2 32.6% 17.5%)',
          primary: 'hsl(217.2 91.2% 59.8%)',
          neutral0: 'hsl(240 10% 3.9%)',
          neutral80: 'hsl(0 0% 98%)',
          neutral20: 'hsl(240 3.7% 15.9%)',
          neutral30: 'hsl(217.2 91.2% 59.8%)',
          neutral10: 'hsl(240 3.7% 15.9%)',
          neutral5: 'hsl(240 3.7% 15.9%)',
          danger: 'hsl(0 62.8% 50.6%)',
          dangerLight: 'hsl(0 62.8% 50.6%)',
        }
      })}
      styles={{
        control: (base, state) => ({ 
          ...base, 
          minHeight: 40, 
          height: 40, 
          borderRadius: 6, 
          borderColor: state.isFocused ? 'hsl(217.2 91.2% 59.8%)' : 'hsl(240 3.7% 15.9%)', 
          backgroundColor: 'hsl(240 10% 3.9%)', 
          color: 'hsl(0 0% 98%)', 
          boxShadow: state.isFocused ? '0 0 0 2px hsl(217.2 91.2% 59.8% / 0.2)' : 'none',
          '&:hover': {
            borderColor: state.isFocused ? 'hsl(217.2 91.2% 59.8%)' : 'hsl(240 3.7% 15.9%)'
          }
        }),
        valueContainer: (base) => ({ 
          ...base, 
          minHeight: 40, 
          height: 40, 
          padding: '8px 12px',
          margin: 0
        }),
        input: (base) => ({ 
          ...base, 
          margin: 0, 
          padding: 0, 
          color: 'hsl(0 0% 98%)' 
        }),
        indicatorsContainer: (base) => ({ 
          ...base, 
          height: 40 
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: 'hsl(240 3.7% 15.9%)'
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: 'hsl(240 5% 64.9%)',
          '&:hover': {
            color: 'hsl(0 0% 98%)'
          }
        }),
        multiValue: (base) => ({ 
          ...base, 
          backgroundColor: 'hsl(240 3.7% 15.9%)', 
          color: 'hsl(0 0% 98%)', 
          borderRadius: 4, 
          minHeight: 20, 
          height: 20, 
          alignItems: 'center', 
          margin: '2px 2px', 
          padding: '0 4px' 
        }),
        multiValueLabel: (base) => ({ 
          ...base, 
          color: 'hsl(0 0% 98%)', 
          fontSize: 12, 
          padding: '0 2px' 
        }),
        multiValueRemove: (base) => ({ 
          ...base, 
          color: 'hsl(0 0% 98%)', 
          ':hover': { 
            backgroundColor: 'hsl(0 62.8% 50.6%)', 
            color: 'hsl(0 0% 98%)' 
          }, 
          borderRadius: 4, 
          padding: 2 
        }),
        option: (base, state) => ({ 
          ...base, 
          minHeight: 36, 
          height: 36, 
          backgroundColor: state.isSelected ? 'hsl(217.2 91.2% 59.8%)' : state.isFocused ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(240 10% 3.9%)', 
          color: 'hsl(0 0% 98%)', 
          fontSize: 14,
          '&:hover': {
            backgroundColor: state.isSelected ? 'hsl(217.2 91.2% 59.8%)' : 'hsl(217.2 32.6% 17.5%)'
          }
        }),
        menu: (base) => ({ 
          ...base, 
          backgroundColor: 'hsl(240 10% 3.9%)', 
          color: 'hsl(0 0% 98%)', 
          borderRadius: 6, 
          marginTop: 2,
          border: '1px solid hsl(240 3.7% 15.9%)'
        }),
        menuList: (base) => ({
          ...base,
          padding: 4
        }),
        placeholder: (base) => ({
          ...base,
          color: 'hsl(240 5% 64.9%)'
        }),
        singleValue: (base) => ({
          ...base,
          color: 'hsl(0 0% 98%)'
        })
      }}
    />
  );
};

export default FornecedorSelector;
