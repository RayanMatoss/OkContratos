
import { useMemo } from "react";
import { RelatorioMensal } from "@/types";

export const useRelatoriosChartData = (
  relatoriosMensais: RelatorioMensal[]
) => {
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  // Chart data transformations
  const contratosData = useMemo(() => {
    return relatoriosMensais.map(r => ({
      name: `${meses[r.mes-1].substring(0, 3)}/${r.ano.toString().substring(2)}`,
      value: r.totalContratos,
      ativos: r.contratosAtivos,
      vencidos: r.contratosVencidos,
    }));
  }, [relatoriosMensais]);

  const ordensData = useMemo(() => {
    return relatoriosMensais.map(r => ({
      name: `${meses[r.mes-1].substring(0, 3)}/${r.ano.toString().substring(2)}`,
      total: r.ordensRealizadas,
      pendentes: r.ordensPendentes,
      concluidas: r.ordensConcluidas,
    }));
  }, [relatoriosMensais]);

  const financeiroData = useMemo(() => {
    return relatoriosMensais.map(r => ({
      name: `${meses[r.mes-1].substring(0, 3)}/${r.ano.toString().substring(2)}`,
      contratos: r.valorTotalContratos / 1000,
      ordens: r.valorTotalOrdens / 1000,
    }));
  }, [relatoriosMensais]);

  return { contratosData, ordensData, financeiroData, meses };
};
