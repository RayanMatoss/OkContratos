import { format } from 'date-fns';

/**
 * Utilitários para manipulação de datas
 * Resolve problemas de fuso horário e conversão entre banco e frontend
 * CORREÇÃO: Resolve problema de perda de 1 dia
 */

/**
 * Converte uma string de data do banco para Date do frontend
 * Garante que a data seja interpretada como local, não UTC
 * CORREÇÃO: Resolve problema de perda de 1 dia
 */
export const parseDatabaseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  
  // CORREÇÃO: Se a data tem timezone UTC (T00:00:00+00:00), tratar como data local
  if (dateString.includes('T00:00:00+00:00')) {
    // Extrair apenas a parte da data (YYYY-MM-DD) e criar como data local
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    
    // CORREÇÃO: Criar data no meio do dia LOCAL para evitar problemas de fuso horário
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }
  
  // Se a data já está no formato YYYY-MM-DD, criar como data local
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    // CORREÇÃO: Criar data no meio do dia para evitar problemas de fuso horário
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }
  
  // Para outros formatos, usar new Date mas ajustar para local
  const date = new Date(dateString);
  
  // Se a data é válida, ajustar para o fuso horário local
  if (!isNaN(date.getTime())) {
    // CORREÇÃO: Criar nova data usando os componentes locais no meio do dia
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, // meio-dia
      0,  // 0 minutos
      0,  // 0 segundos
      0   // 0 milissegundos
    );
  }
  
  return null;
};

/**
 * Converte uma Date do frontend para string do banco
 * Garante que a data seja salva no formato correto
 * CORREÇÃO: Mantém a data exata selecionada pelo usuário
 */
export const formatDateForDatabase = (date: Date | null | undefined): string | null => {
  if (!date || isNaN(date.getTime())) return null;
  
  // CORREÇÃO: Usar a data exata selecionada, sem ajustes de fuso horário
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Converte uma Date para string ISO para operações que precisam de timestamp
 * CORREÇÃO: Mantém a data exata selecionada
 */
export const formatDateForISO = (date: Date | null | undefined): string | null => {
  if (!date || isNaN(date.getTime())) return null;
  
  // CORREÇÃO: Criar data no meio do dia para evitar problemas de fuso horário
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
 * CORREÇÃO: Garante que a data seja sempre interpretada como local
 */
export const createLocalDate = (year: number, month: number, day: number): Date => {
  // CORREÇÃO: month - 1 porque Date() usa 0-11 para meses
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

/**
 * Ajusta uma data existente para o meio do dia local
 * CORREÇÃO: Evita problemas de fuso horário ao normalizar datas
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
 * CORREÇÃO: Função de debug para verificar conversão de datas
 * Útil para identificar problemas de fuso horário
 */
export const debugDateConversion = (dateString: string, expectedDate: string) => {
  console.log('=== Debug de Conversão de Data ===');
  console.log(`String original: "${dateString}"`);
  console.log(`Data esperada: ${expectedDate}`);
  
  const parsedDate = parseDatabaseDate(dateString);
  console.log(`Data convertida: ${parsedDate}`);
  
  if (parsedDate) {
    const formattedDate = format(parsedDate, 'dd/MM/yyyy');
    console.log(`Data formatada: ${formattedDate}`);
    console.log(`Conversão correta: ${formattedDate === expectedDate ? '✅ SIM' : '❌ NÃO'}`);
  }
  
  console.log('================================');
  return parsedDate;
};

/**
 * NOVA FUNÇÃO: Debug completo de conversão de datas para identificar problema de 1 dia a menos
 * Testa todas as etapas da conversão
 */
export const debugCompleteDateConversion = (dateString: string, expectedDate: string) => {
  console.log('🔍 === DEBUG COMPLETO DE CONVERSÃO DE DATA ===');
  console.log(`📅 String original do banco: "${dateString}"`);
  console.log(`🎯 Data esperada: ${expectedDate}`);
  
  // Teste 1: Conversão direta com new Date()
  const directDate = new Date(dateString);
  console.log(`📊 Conversão direta (new Date): ${directDate}`);
  console.log(`📊 Conversão direta (ISO): ${directDate.toISOString()}`);
  console.log(`📊 Conversão direta (Local): ${directDate.toString()}`);
  
  // Teste 2: Conversão com parseDatabaseDate
  const parsedDate = parseDatabaseDate(dateString);
  console.log(`🔧 Conversão com parseDatabaseDate: ${parsedDate}`);
  
  if (parsedDate) {
    // Teste 3: Formatação com date-fns
    const formattedDate = format(parsedDate, 'dd/MM/yyyy');
    console.log(`📝 Data formatada (dd/MM/yyyy): ${formattedDate}`);
    
    // Teste 4: Formatação com toLocaleDateString
    const localeDate = parsedDate.toLocaleDateString('pt-BR');
    console.log(`🌍 Data localizada (pt-BR): ${localeDate}`);
    
    // Teste 5: Verificação de conversão
    const isCorrect = formattedDate === expectedDate;
    console.log(`✅ Conversão correta: ${isCorrect ? 'SIM' : 'NÃO'}`);
    
    if (!isCorrect) {
      console.log(`❌ PROBLEMA IDENTIFICADO: Data esperada ${expectedDate} vs Data obtida ${formattedDate}`);
      console.log(`❌ Diferença: ${expectedDate} vs ${formattedDate}`);
    }
    
    // Teste 6: Verificar componentes da data
    console.log(`🔍 Componentes da data convertida:`);
    console.log(`   - Ano: ${parsedDate.getFullYear()}`);
    console.log(`   - Mês: ${parsedDate.getMonth() + 1} (${parsedDate.getMonth()})`);
    console.log(`   - Dia: ${parsedDate.getDate()}`);
    console.log(`   - Hora: ${parsedDate.getHours()}:${parsedDate.getMinutes()}:${parsedDate.getSeconds()}`);
  }
  
  console.log('🔍 === FIM DO DEBUG ===');
  return parsedDate;
};

/**
 * NOVA FUNÇÃO: Teste de conversão reversa para verificar se há perda
 */
export const testDateRoundTrip = (dateString: string) => {
  console.log('🔄 === TESTE DE CONVERSÃO REVERSA ===');
  console.log(`📅 Data original: ${dateString}`);
  
  // Conversão para Date
  const parsedDate = parseDatabaseDate(dateString);
  console.log(`📊 Data convertida: ${parsedDate}`);
  
  if (parsedDate) {
    // Conversão de volta para string
    const backToString = formatDateForDatabase(parsedDate);
    console.log(`📝 Conversão reversa: ${backToString}`);
    
    // Verificar se houve perda
    const noLoss = dateString === backToString;
    console.log(`✅ Sem perda de dados: ${noLoss ? 'SIM' : 'NÃO'}`);
    
    if (!noLoss) {
      console.log(`❌ PERDA IDENTIFICADA: ${dateString} → ${backToString}`);
    }
  }
  
  console.log('🔄 === FIM DO TESTE ===');
  return parsedDate;
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

/**
 * NOVA FUNÇÃO: Teste específico para o problema de 1 dia a menos
 * Testa o caso real identificado no debug
 */
export const testRealDateProblem = () => {
  console.log('🧪 === TESTE DO PROBLEMA REAL IDENTIFICADO ===');
  
  // Caso real do debug: contrato 022/2025
  const testCases = [
    {
      input: '2025-02-26T00:00:00+00:00',
      expected: '26/02/2025',
      description: 'Data início contrato 022/2025'
    },
    {
      input: '2025-12-31T00:00:00+00:00',
      expected: '31/12/2025',
      description: 'Data término contrato 022/2025'
    },
    {
      input: '2024-07-31T00:00:00+00:00',
      expected: '31/07/2024',
      description: 'Data início contrato 104/2025'
    },
    {
      input: '2024-07-31',
      expected: '31/07/2024',
      description: 'Data sem timezone (formato simples)'
    }
  ];

  testCases.forEach(({ input, expected, description }) => {
    console.log(`\n🔍 Testando: ${description}`);
    console.log(`   📅 Input: "${input}"`);
    console.log(`   🎯 Esperado: ${expected}`);
    
    // Teste com a função corrigida
    const parsed = parseDatabaseDate(input);
    if (parsed) {
      const formatted = parsed.toLocaleDateString('pt-BR');
      const isCorrect = formatted === expected;
      
      console.log(`   🔧 Data convertida: ${parsed}`);
      console.log(`   📝 Data formatada: ${formatted}`);
      console.log(`   ✅ Resultado: ${isCorrect ? 'CORRETO' : '❌ INCORRETO'}`);
      
      if (!isCorrect) {
        console.log(`   ❌ PROBLEMA: Esperado ${expected}, Obtido ${formatted}`);
      }
    } else {
      console.log(`   ❌ ERRO: Falha na conversão`);
    }
  });
  
  console.log('\n🧪 === FIM DO TESTE ===');
}; 