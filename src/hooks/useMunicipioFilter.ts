import { useAuth } from './useAuth';

export function useMunicipioFilter() {
  const { municipio } = useAuth();

  const filterByMunicipio = <T extends Record<string, unknown>>(data: T[], municipioField: string = 'municipioId'): T[] => {
    if (!municipio) return [];
    
    return data.filter(item => item[municipioField] === municipio.id);
  };

  const addMunicipioToData = <T extends Record<string, unknown>>(data: T): T & { municipio_id: string } => {
    return {
      ...data,
      municipio_id: municipio?.id || ''
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