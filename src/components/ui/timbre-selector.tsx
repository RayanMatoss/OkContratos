import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { getSecretariasDisponiveis, getTimbreConfig, TimbreConfig } from '@/lib/timbreConfig';

interface TimbreSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TimbreSelector({ 
  value, 
  onValueChange, 
  placeholder = "Selecione o timbre",
  className 
}: TimbreSelectorProps) {
  const secretarias = getSecretariasDisponiveis();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="prefeitura">
          🏛️ Prefeitura (Padrão)
        </SelectItem>
        {secretarias.map((secretaria) => (
          <SelectItem key={secretaria} value={secretaria}>
            📋 {secretaria.charAt(0).toUpperCase() + secretaria.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Hook para usar configurações de timbre
export function useTimbreConfig(secretaria?: string) {
  const timbreConfig = getTimbreConfig(secretaria);
  
  return {
    timbreConfig,
    url: timbreConfig.url,
    posicao: timbreConfig.posicao,
    tamanho: timbreConfig.tamanho,
    secretariasDisponiveis: getSecretariasDisponiveis()
  };
} 