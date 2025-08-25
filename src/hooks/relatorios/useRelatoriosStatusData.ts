
import { useMemo } from "react";
import { RelatorioMensal } from "@/types";

export const useRelatoriosStatusData = (
  relatoriosFiltrados: RelatorioMensal[]
) => {
  // Get the current date to use as fallback
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Get the most recent report, or use default values if none exists
  const ultimoRelatorio = useMemo(() => {
    return relatoriosFiltrados[0] || {
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
  }, [relatoriosFiltrados, currentMonth, currentYear]);

  const statusContratosData = useMemo(() => {
    return [
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
  }, [ultimoRelatorio]);

  const statusOrdensData = useMemo(() => {
    return [
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
  }, [ultimoRelatorio]);

  return { ultimoRelatorio, statusContratosData, statusOrdensData };
};
