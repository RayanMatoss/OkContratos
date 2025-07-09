import { useAuth } from './useAuth';

export function useMunicipioFilter() {
  const { municipio } = useAuth();

  const filterByMunicipio = <T extends { municipioId?: string }>(data: T[]): T[] => {
    if (!municipio) return [];
    
    return data.filter(item => item.municipioId === municipio.id);
  };

  const addMunicipioToData = <T extends Record<string, any>>(data: T): T & { municipioId: string } => {
    return {
      ...data,
      municipioId: municipio?.id || ''
    };
  };

  const getCurrentMunicipioId = (): string => {
    return municipio?.id || '';
  };

  return {
    municipio,
    filterByMunicipio,
    addMunicipioToData,
    getCurrentMunicipioId
  };
} 