
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RelatorioMensal } from "@/types";
import { format, subMonths, isAfter, isBefore, startOfMonth, endOfMonth } from "date-fns";

export const useRelatoriosData = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("6");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatoriosMensais, setRelatoriosMensais] = useState<RelatorioMensal[]>([]);
  
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                 "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

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
          `)
          .gte('created_at', format(dataInicial, 'yyyy-MM-dd'));
        
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
          .gte('created_at', format(dataInicial, 'yyyy-MM-dd'));
        
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

        // Criar mapa de valores de itens para uso rápido
        const itensMap = new Map();
        itens?.forEach(item => {
          itensMap.set(item.id, item);
        });

        // Calcular valor total das ordens
        const ordensValorMap = new Map();
        itensConsumidos?.forEach(ic => {
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
        
        // Iterar pelos últimos n meses
        for (let i = 0; i < numMeses; i++) {
          const dataRef = subMonths(dataAtual, i);
          const mes = dataRef.getMonth() + 1;
          const ano = dataRef.getFullYear();
          const inicioMes = startOfMonth(dataRef);
          const fimMes = endOfMonth(dataRef);

          // Filtrar contratos do mês
          const contratosMes = contratos?.filter(c => {
            const dataContrato = new Date(c.created_at);
            return dataContrato.getMonth() + 1 === mes && dataContrato.getFullYear() === ano;
          }) || [];
          
          // Contar contratos por status
          const contratosAtivos = contratosMes.filter(c => {
            const dataTermino = new Date(c.data_termino);
            return c.status === "Ativo" || (c.status !== "Expirado" && isAfter(dataTermino, dataAtual));
          }).length;
          
          const contratosVencidos = contratosMes.filter(c => {
            const dataTermino = new Date(c.data_termino);
            return c.status === "Expirado" || (c.status !== "Ativo" && isBefore(dataTermino, dataAtual));
          }).length;

          // Calcular valor total dos contratos
          const valorTotalContratos = contratosMes.reduce((total, c) => total + (c.valor || 0), 0);

          // Filtrar ordens do mês
          const ordensMes = ordens?.filter(o => {
            const dataOrdem = new Date(o.created_at);
            return dataOrdem.getMonth() + 1 === mes && dataOrdem.getFullYear() === ano;
          }) || [];
          
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

        setRelatoriosMensais(relatorios);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [periodoSelecionado]);
  
  // Filter reports based on selected period
  const relatoriosFiltrados = relatoriosMensais;

  // Chart data transformations
  const contratosData = relatoriosFiltrados.map(r => ({
    name: `${meses[r.mes-1].substring(0, 3)}/${r.ano.toString().substring(2)}`,
    value: r.totalContratos,
    ativos: r.contratosAtivos,
    vencidos: r.contratosVencidos,
  }));

  const ordensData = relatoriosFiltrados.map(r => ({
    name: `${meses[r.mes-1].substring(0, 3)}/${r.ano.toString().substring(2)}`,
    total: r.ordensRealizadas,
    pendentes: r.ordensPendentes,
    concluidas: r.ordensConcluidas,
  }));

  const financeiroData = relatoriosFiltrados.map(r => ({
    name: `${meses[r.mes-1].substring(0, 3)}/${r.ano.toString().substring(2)}`,
    contratos: r.valorTotalContratos / 1000,
    ordens: r.valorTotalOrdens / 1000,
  }));

  // Get the current date to use as fallback
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Get the most recent report, or use default values if none exists
  const ultimoRelatorio = relatoriosFiltrados[0] || {
    mes: currentMonth,
    ano: currentYear,
    totalContratos: 0,
    contratosVencidos: 0,
    contratosAtivos: 0,
    ordensRealizadas: 0,
    ordensPendentes: 0,
    ordensConcluidas: 0,
    valorTotalContratos: 0,
    valorTotalOrdens: 0,
  };

  const statusContratosData = [
    { 
      name: "Ativos", 
      value: ultimoRelatorio.contratosAtivos, 
      color: "#10B981" 
    },
    { 
      name: "Vencidos", 
      value: ultimoRelatorio.contratosVencidos, 
      color: "#EF4444"
    }
  ];

  const statusOrdensData = [
    { 
      name: "Concluídas", 
      value: ultimoRelatorio.ordensConcluidas, 
      color: "#10B981" 
    },
    { 
      name: "Pendentes", 
      value: ultimoRelatorio.ordensPendentes, 
      color: "#F59E0B"
    }
  ];

  return {
    periodoSelecionado,
    setPeriodoSelecionado,
    meses,
    relatoriosFiltrados,
    contratosData,
    ordensData,
    financeiroData,
    statusContratosData,
    statusOrdensData,
    ultimoRelatorio,
    loading,
    error
  };
};
