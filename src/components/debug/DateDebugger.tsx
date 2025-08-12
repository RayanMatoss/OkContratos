import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  debugCompleteDateConversion, 
  testDateRoundTrip, 
  parseDatabaseDate,
  formatDateForDatabase,
  testRealDateProblem // NOVA: Função de teste do problema real
} from '@/lib/dateUtils';

const DateDebugger: React.FC = () => {
  const [dateString, setDateString] = useState('2024-07-31');
  const [expectedDate, setExpectedDate] = useState('31/07/2024');
  const [debugResults, setDebugResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    setDebugResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setDebugResults([]);
  };

  const testDateConversion = () => {
    addLog('=== INICIANDO TESTE DE CONVERSÃO ===');
    
    // Teste 1: Conversão básica
    addLog(`Testando conversão: "${dateString}" → "${expectedDate}"`);
    
    // Teste 2: Debug completo
    const parsed = debugCompleteDateConversion(dateString, expectedDate);
    addLog(`Data convertida: ${parsed}`);
    
    // Teste 3: Teste de ida e volta
    testDateRoundTrip(dateString);
    
    // Teste 4: Verificar se há diferença
    if (parsed) {
      const formatted = parsed.toLocaleDateString('pt-BR');
      const isCorrect = formatted === expectedDate;
      addLog(`✅ Resultado: ${isCorrect ? 'CORRETO' : 'INCORRETO'}`);
      if (!isCorrect) {
        addLog(`❌ Esperado: ${expectedDate}, Obtido: ${formatted}`);
      }
    }
    
    addLog('=== FIM DO TESTE ===');
  };

  const testMultipleDates = () => {
    const testDates = [
      { input: '2024-07-31', expected: '31/07/2024' },
      { input: '2024-12-25', expected: '25/12/2024' },
      { input: '2025-01-01', expected: '01/01/2025' },
      { input: '2024-02-29', expected: '29/02/2024' }, // Ano bissexto
    ];

    addLog('=== TESTANDO MÚLTIPLAS DATAS ===');
    
    testDates.forEach(({ input, expected }) => {
      addLog(`\nTestando: ${input} → ${expected}`);
      const parsed = parseDatabaseDate(input);
      if (parsed) {
        const formatted = parsed.toLocaleDateString('pt-BR');
        const isCorrect = formatted === expected;
        addLog(`${isCorrect ? '✅' : '❌'} ${input} → ${formatted} (esperado: ${expected})`);
      }
    });
    
    addLog('=== FIM DOS TESTES ===');
  };

  const testTimezoneIssues = () => {
    addLog('=== TESTANDO PROBLEMAS DE FUSO HORÁRIO ===');
    
    // Teste com diferentes formatos
    const testCases = [
      '2024-07-31',
      '2024-07-31T00:00:00.000Z',
      '2024-07-31T12:00:00.000Z',
      '2024-07-31T23:59:59.999Z',
    ];

    testCases.forEach(testCase => {
      addLog(`\nTestando formato: "${testCase}"`);
      
      // Conversão direta
      const directDate = new Date(testCase);
      addLog(`  new Date(): ${directDate.toISOString()}`);
      addLog(`  new Date() local: ${directDate.toString()}`);
      
      // Conversão com nossa função
      const parsedDate = parseDatabaseDate(testCase);
      if (parsedDate) {
        addLog(`  parseDatabaseDate: ${parsedDate.toISOString()}`);
        addLog(`  parseDatabaseDate local: ${parsedDate.toString()}`);
        addLog(`  parseDatabaseDate pt-BR: ${parsedDate.toLocaleDateString('pt-BR')}`);
      }
    });
    
    addLog('=== FIM DOS TESTES DE FUSO HORÁRIO ===');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔍 Debug de Conversão de Datas</CardTitle>
        <p className="text-sm text-muted-foreground">
          Teste as conversões de data para identificar o problema de 1 dia a menos
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controles de teste */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateString">Data do Banco (YYYY-MM-DD)</Label>
            <Input
              id="dateString"
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              placeholder="2024-07-31"
            />
          </div>
          <div>
            <Label htmlFor="expectedDate">Data Esperada (dd/MM/yyyy)</Label>
            <Input
              id="expectedDate"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              placeholder="31/07/2024"
            />
          </div>
        </div>

        {/* Botões de teste */}
        <div className="flex gap-2">
          <Button onClick={testDateConversion} variant="default">
            🧪 Testar Conversão
          </Button>
          <Button onClick={testMultipleDates} variant="secondary">
            📅 Testar Múltiplas Datas
          </Button>
          <Button onClick={testTimezoneIssues} variant="outline">
            🌍 Testar Fuso Horário
          </Button>
          <Button onClick={testRealDateProblem} variant="destructive">
            🚨 Testar Problema Real
          </Button>
          <Button onClick={clearLogs} variant="destructive">
            🗑️ Limpar Logs
          </Button>
        </div>

        {/* Resultados dos testes */}
        <div className="border rounded-lg p-4 bg-muted/50">
          <Label className="text-sm font-medium">Logs de Debug:</Label>
          <div className="mt-2 max-h-96 overflow-y-auto font-mono text-xs">
            {debugResults.length === 0 ? (
              <p className="text-muted-foreground">Execute um teste para ver os resultados...</p>
            ) : (
              debugResults.map((log, index) => (
                <div key={index} className="py-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instruções */}
        <div className="text-sm text-muted-foreground">
          <p><strong>Como usar:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Digite uma data do banco no formato YYYY-MM-DD</li>
            <li>Digite a data esperada no formato dd/MM/yyyy</li>
            <li>Clique em "Testar Conversão" para ver o resultado</li>
            <li>Use "Testar Múltiplas Datas" para verificar várias datas</li>
            <li>Use "Testar Fuso Horário" para identificar problemas de timezone</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateDebugger; 