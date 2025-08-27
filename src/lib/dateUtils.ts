import { format } from 'date-fns';

/**
 * Utilitários para manipulação de datas
 * Resolve problemas de fuso horário e conversão entre banco e frontend
 */

/**
 * Converte uma string de data do banco para Date do frontend
 * Garante que a data seja interpretada como local, não UTC
 */
export function parseDatabaseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  
  try {
    // Se já é uma data ISO válida, retornar diretamente
    if (dateString.includes('T') && dateString.includes('Z')) {
      return new Date(dateString);
    }
    
    // Se é uma data no formato brasileiro (DD/MM/YYYY)
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // Se é uma data no formato YYYY-MM-DD
    if (dateString.includes('-') && !dateString.includes('T')) {
      return new Date(dateString);
    }
    
    // Tentar parse direto
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) {
      return null;
    }
    
    return parsed;
  } catch (error) {
    return null;
  }
}

/**
 * Converte uma Date do frontend para string do banco
 * Garante que a data seja salva no formato correto
 */
export const formatDateForDatabase = (date: Date | null | undefined): string | null => {
  if (!date || isNaN(date.getTime())) return null;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Converte uma Date para string ISO para operações que precisam de timestamp
 */
export const formatDateForISO = (date: Date | null | undefined): string | null => {
  if (!date || isNaN(date.getTime())) return null;
  
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12, // meio-dia
    0,  // 0 minutos
    0   // 0 segundos
  );
  
  return localDate.toISOString();
};

/**
 * Cria uma data local no meio do dia para evitar problemas de fuso horário
 */
export const createLocalDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

/**
 * Ajusta uma data existente para o meio do dia local
 */
export const adjustToLocalMidday = (date: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12, // meio-dia
    0,  // 0 minutos
    0,  // 0 segundos
    0   // 0 milissegundos
  );
};

/**
 * Verifica se uma data é válida
 */
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Compara duas datas ignorando o tempo
 */
export const compareDates = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
};

/**
 * Verifica se uma data está entre duas outras (inclusive)
 */
export const isDateBetween = (date: Date, start: Date, end: Date): boolean => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  return d >= s && d <= e;
};

/**
 * Adiciona dias a uma data
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtrai dias de uma data
 */
export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

/**
 * Calcula a diferença em dias entre duas datas
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
  const timeDiff = d2.getTime() - d1.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}; 