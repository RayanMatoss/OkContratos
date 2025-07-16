
import { useState, useCallback } from 'react';

export const useCpfCnpjMask = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const formatCpfCnpj = useCallback((input: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = input.replace(/\D/g, '');
    
    // Limita a 14 dígitos (CNPJ)
    const limitedNumbers = numbers.slice(0, 14);
    
    // Aplica a máscara baseada no número de dígitos
    if (limitedNumbers.length <= 11) {
      // Formato CPF: 999.999.999-99
      return limitedNumbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formato CNPJ: 99.999.999/9999-99
      return limitedNumbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  }, []);

  const handleChange = useCallback((newValue: string) => {
    const formatted = formatCpfCnpj(newValue);
    setValue(formatted);
    return formatted;
  }, [formatCpfCnpj]);

  const getPlaceholder = useCallback(() => {
    const numbers = value.replace(/\D/g, '');
    return numbers.length <= 11 ? 'CPF: 000.000.000-00' : 'CNPJ: 00.000.000/0000-00';
  }, [value]);

  return {
    value,
    setValue,
    handleChange,
    getPlaceholder,
    formatCpfCnpj
  };
};
