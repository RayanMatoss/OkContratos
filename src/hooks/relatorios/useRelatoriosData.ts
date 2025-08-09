
import { useState } from "react";
import { useFetchRelatoriosData } from "./useFetchRelatoriosData";
import { useRelatoriosChartData } from "./useRelatoriosChartData";
import { useRelatoriosStatusData } from "./useRelatoriosStatusData";

export const useRelatoriosData = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("6");
  
  const { relatoriosMensais, loading, error } = useFetchRelatoriosData(periodoSelecionado);
  
  // We're returning all reports without filtering as they're already filtered in useFetchRelatoriosData
  const relatoriosFiltrados = relatoriosMensais;
  
  const { contratosData, ordensData, financeiroData, meses } = useRelatoriosChartData(relatoriosFiltrados);
  const { ultimoRelatorio, statusContratosData, statusOrdensData } = useRelatoriosStatusData(relatoriosFiltrados);

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
