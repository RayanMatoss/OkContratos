
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths } from "date-fns";
import { RelatorioMensal } from "@/types";
import { parseDatabaseDate } from "@/lib/dateUtils";

export const useFetchRelatoriosData = (periodoSelecionado: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatoriosMensais, setRelatoriosMensais] = useState<RelatorioMensal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const numMeses = parseInt(periodoSelecionado);
        const dataAtual = new Date();
        const dataInicial = subMonths(dataAtual, numMeses);
        
        // Buscar contratos
        const { data: contratos, error: contratosError } = await supabase
          .from("contratos")
          .select(`
            id,
            numero,
            valor,
            data_inicio,
            data_termino,
            status,
            created_at
          `);
        
        console.log('Contratos retornados:', contratos);
        
        if (contratosError) throw new Error(`Erro ao buscar contratos: ${contratosError.message}`);

        // Buscar ordens
        const { data: ordens, error: ordensError } = await supabase
          .from("ordens")
          .select(`
            id,
            numero,
            status,
            data_emissao,
            created_at,
            contrato_id
          `)
          .gte('data_emissao', format(dataInicial, 'yyyy-MM-dd'));
        
        if (ordensError) throw new Error(`Erro ao buscar ordens: ${ordensError.message}`);

        // Buscar itens consumidos para calcular valores das ordens
        const { data: itensConsumidos, error: itensError } = await supabase
          .from("itens_consumidos")
          .select(`
            quantidade,
            item_id,
            ordem_id
          `);
        
        if (itensError) throw new Error(`Erro ao buscar itens consumidos: ${itensError.message}`);

        // Buscar itens para calcular valores
        const { data: itens, error: itensBaseError } = await supabase
          .from("itens")
          .select(`
            id,
            valor_unitario,
            contrato_id
          `);
        
        if (itensBaseError) throw new Error(`Erro ao buscar itens: ${itensBaseError.message}`);

        // Processar dados dos contratos
        const contratosProcessados = contratos?.map(contrato => ({
          ...contrato,
          data_inicio: parseDatabaseDate(contrato.data_inicio),
          data_termino: parseDatabaseDate(contrato.data_termino),
          created_at: parseDatabaseDate(contrato.created_at)
        })) || [];

        // Processar dados das ordens
        const ordensProcessadas = ordens?.map(ordem => ({
          ...ordem,
          data_emissao: parseDatabaseDate(ordem.data_emissao),
          created_at: parseDatabaseDate(ordem.created_at)
        })) || [];

        // Processar os dados
        const processedData = processRelatoriosData(
          contratosProcessados,
          ordensProcessadas,
          itensConsumidos || [],
          itens || [],
          numMeses
        );

        setRelatoriosMensais(processedData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [periodoSelecionado]);

  return { relatoriosMensais, loading, error };
};

// Helper function to process the raw data into monthly reports
function processRelatoriosData(
  contratos: any[],
  ordens: any[],
  itensConsumidos: any[],
  itens: any[],
  numMeses: number
): RelatorioMensal[] {
  // Criar mapa de valores de itens para uso rápido
  const itensMap = new Map();
  itens.forEach(item => {
    itensMap.set(item.id, item);
  });

  // Calcular valor total das ordens
  const ordensValorMap = new Map();
  itensConsumidos.forEach(ic => {
    const item = itensMap.get(ic.item_id);
    if (item) {
      const valorItem = ic.quantidade * item.valor_unitario;
      if (ordensValorMap.has(ic.ordem_id)) {
        ordensValorMap.set(ic.ordem_id, ordensValorMap.get(ic.ordem_id) + valorItem);
      } else {
        ordensValorMap.set(ic.ordem_id, valorItem);
      }
    }
  });

  // Gerar relatórios mensais
  const relatorios: RelatorioMensal[] = [];
  const dataAtual = new Date();
  
  // Iterar pelos últimos n meses
  for (let i = 0; i < numMeses; i++) {
    const dataRef = subMonths(dataAtual, i);
    console.log('Processando mês:', dataRef.toISOString());
    const mes = dataRef.getMonth() + 1;
    const ano = dataRef.getFullYear();
    
    // Filtrar contratos do mês
    const contratosMes = contratos.filter(c => {
      const dataContrato = new Date(c.data_inicio);
      return dataContrato.getMonth() + 1 === mes && dataContrato.getFullYear() === ano;
    });
    
    // Contar contratos por status
    const contratosAtivos = contratosMes.filter(c => c.status === "Ativo").length;
    const contratosVencidos = contratosMes.filter(c => c.status === "Expirado").length;

    // Calcular valor total dos contratos
    const valorTotalContratos = contratosMes.reduce((total, c) => total + (c.valor || 0), 0);

    // Filtrar ordens do mês
    const ordensMes = ordens.filter(o => {
      const dataOrdem = new Date(o.created_at);
      return dataOrdem.getMonth() + 1 === mes && dataOrdem.getFullYear() === ano;
    });
    
    // Contar ordens por status
    const ordensConcluidas = ordensMes.filter(o => o.status === "Concluída").length;
    const ordensPendentes = ordensMes.filter(o => o.status === "Pendente").length;
    
    // Calcular valor total das ordens
    let valorTotalOrdens = 0;
    ordensMes.forEach(o => {
      if (ordensValorMap.has(o.id)) {
        valorTotalOrdens += ordensValorMap.get(o.id);
      }
    });

    relatorios.push({
      mes,
      ano,
      totalContratos: contratosMes.length,
      contratosAtivos,
      contratosVencidos,
      ordensRealizadas: ordensMes.length,
      ordensConcluidas,
      ordensPendentes,
      valorTotalContratos,
      valorTotalOrdens
    });
  }

  // Ordenar por data, mais recentes primeiro
  relatorios.sort((a, b) => {
    if (a.ano !== b.ano) return b.ano - a.ano;
    return b.mes - a.mes;
  });

  return relatorios;
}
