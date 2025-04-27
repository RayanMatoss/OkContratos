
import { useState } from "react";
import { RelatorioMensal } from "@/types";
import { relatorios } from "@/data/mockData";

export const useRelatoriosData = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("6");
  
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                 "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Filter reports based on selected period
  const relatoriosFiltrados = relatorios
    .slice(0, parseInt(periodoSelecionado))
    .sort((a, b) => {
      if (a.ano !== b.ano) return a.ano - b.ano;
      return a.mes - b.mes;
    });

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

  const ultimoRelatorio = relatoriosFiltrados[0] || {
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
    ultimoRelatorio
  };
};
