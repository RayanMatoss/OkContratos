
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths } from "date-fns";
import { RelatorioMensal } from "@/types";
import { parseDatabaseDate } from "@/lib/dateUtils";
import { useAuth } from "@/hooks/useAuth";

export const useFetchRelatoriosData = (periodoSelecionado: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatoriosMensais, setRelatoriosMensais] = useState<RelatorioMensal[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) return;

        const numMeses = parseInt(periodoSelecionado);
        const dataAtual = new Date();
        const dataInicial = subMonths(dataAtual, numMeses);
        
        // Buscar contratos usando a mesma view do Dashboard
        const { data: contratos, error: contratosError } = await supabase
          .from("vw_contratos_limpos")
          .select("*");
        
        if (contratosError) throw new Error(`Erro ao buscar contratos: ${contratosError.message}`);

        // Buscar ordens
        const { data: ordens, error: ordensError } = await supabase
          .from("ordens")
          .select(`
            id,
            numero,
            data_emissao,
            contrato_id,
            status
          `);
        
        if (ordensError) throw ordensError;

        const { data: itens, error: itensError } = await supabase
          .from("itens")
          .select(`
            id,
            contrato_id,
            quantidade,
            valor_unitario
          `);

        if (itensError) throw itensError;

        const ordensProcessadas = ordens?.map(ordem => {
          const itensContrato = itens?.filter(item => item.contrato_id === ordem.contrato_id) || [];
          const valorTotalItens = itensContrato.reduce((total, item) => {
            return total + (parseFloat(item.quantidade) * parseFloat(item.valor_unitario));
          }, 0);

          return {
            ...ordem,
            valor_total: valorTotalItens
          };
        }) || [];

        // Processar dados dos contratos
        const contratosProcessados = contratos?.map(contrato => ({
          ...contrato,
          data_inicio: parseDatabaseDate(contrato.data_inicio),
          data_termino: parseDatabaseDate(contrato.data_termino),
          created_at: parseDatabaseDate(contrato.created_at),
          // Usar valor direto do contrato em vez de calcular
          valor: parseFloat(String(contrato.valor || 0))
        })) || [];

        // Processar os dados
        const processedData = processRelatoriosData(
          contratosProcessados,
          ordensProcessadas,
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
  }, [periodoSelecionado, user]);

  return { relatoriosMensais, loading, error };
};

// Helper function to process the raw data into monthly reports
function processRelatoriosData(
  contratos: any[],
  ordens: any[],
  numMeses: number
): RelatorioMensal[] {
  // Gerar relatórios mensais
  const relatorios: RelatorioMensal[] = [];
  const dataAtual = new Date();
  
  // Iterar pelos últimos n meses
  for (let i = 0; i < numMeses; i++) {
    const dataRef = subMonths(dataAtual, i);
    const mes = dataRef.getMonth() + 1;
    const ano = dataRef.getFullYear();
    
    // Filtrar contratos do mês
    const contratosMes = contratos.filter(c => {
      // Contrato é do mês APENAS se INICIOU no mês
      const dataInicio = new Date(c.data_inicio);
      const resultado = dataInicio.getMonth() + 1 === mes && dataInicio.getFullYear() === ano;
      
      return resultado;
    });
    
    // Contar contratos por status (APENAS contratos que INICIARAM no mês)
    const contratosAtivos = contratosMes.filter(c => c.status === "Ativo").length;
    const contratosVencidos = contratosMes.filter(c => c.status === "Expirado").length;

    // Calcular valor total dos contratos
    const valorTotalContratos = contratosMes.reduce((total, c) => total + (c.valor || 0), 0);

    // Filtrar ordens do mês
    const ordensMes = ordens.filter(o => {
      const dataOrdem = new Date(o.data_emissao);
      const resultado = dataOrdem.getMonth() + 1 === mes && dataOrdem.getFullYear() === ano;
      
      return resultado;
    });
    
    // Contar ordens por status
    const ordensConcluidas = ordensMes.filter(o => o.status === "Concluída").length;
    const ordensPendentes = ordensMes.filter(o => o.status === "Pendente").length;
    
    // Para ordens, vamos usar um valor estimado baseado no número de ordens
    // já que não temos mais acesso aos valores detalhados dos itens
    const valorTotalOrdens = ordensMes.length * 1000; // Valor estimado por ordem

    relatorios.push({
      id: `${ano}-${mes.toString().padStart(2, '0')}`,
      mes,
      ano,
      totalContratos: contratosMes.length,
      contratosAtivos,
      contratosVencidos,
      ordensRealizadas: ordensMes.length,
      ordensConcluidas,
      ordensPendentes,
      valorTotalContratos,
      valorTotalOrdens,
      createdAt: new Date(ano, mes - 1, 1)
    });
  }

  // Ordenar por data, mais recentes primeiro
  return relatorios.reverse();
}
