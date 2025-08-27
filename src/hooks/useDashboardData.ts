import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseDatabaseDate } from "@/lib/dateUtils";
import { useItensAlerta } from "./useItensAlerta";

export interface DashboardData {
  totalContratos: number;
  contratosAVencer: number;
  totalFornecedores: number;
  ordensPendentes: number;
  statusContratosData: Array<{ name: string; value: number; color: string }>;
  ordensData: Array<{ name: string; value: number }>;
  contratosRecentes: any[];
  ordensPendentesLista: any[];
  itensAlerta: any[];
  fornecedores: any[];
}

export const useDashboardData = () => {
  const { toast } = useToast();
  const { itensAlerta, loading: loadingItensAlerta } = useItensAlerta();
  const [data, setData] = useState<DashboardData>({
    totalContratos: 0,
    contratosAVencer: 0,
    totalFornecedores: 0,
    ordensPendentes: 0,
    statusContratosData: [],
    ordensData: [],
    contratosRecentes: [],
    ordensPendentesLista: [],
    itensAlerta: [],
    fornecedores: []
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch contratos usando a mesma view dos Relatórios
      const { data: contratosAtivos, error: contratosAtivosError } = await supabase
        .from("vw_contratos_limpos")
        .select("*"); // Remover filtro por status já que o campo pode não existir

      if (contratosAtivosError) throw contratosAtivosError;



      // Fetch ordens
      const { data: ordens, error: ordensError } = await supabase
        .from("ordens")
        .select(`
          *,
          contrato:contrato_id (
            numero,
            fornecedor:fornecedor_id (
              nome
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (ordensError) throw ordensError;

      // Fetch fornecedores
      const { count: fornecedoresCount, error: fornecedoresCountError } = await supabase
        .from("fornecedores")
        .select("*", { count: 'exact', head: true });
      if (fornecedoresCountError) throw fornecedoresCountError;

      // Fetch lista completa de fornecedores para o dashboard
      const { data: fornecedores, error: fornecedoresListError } = await supabase
        .from("fornecedores")
        .select("*");
      if (fornecedoresListError) throw fornecedoresListError;

      // Processar dados dos contratos
      const contratosProcessados = contratosAtivos?.map(contrato => ({
        id: contrato.id,
        numero: contrato.numero || '',
        objeto: contrato.objeto || '',
        valor: contrato.valor ? parseFloat(contrato.valor) : 0,
        data_inicio: contrato.data_inicio ? parseDatabaseDate(contrato.data_inicio) : new Date(),
        data_termino: contrato.data_termino ? parseDatabaseDate(contrato.data_termino) : new Date(),
        fornecedor_nome: contrato.fornecedor_nome || '',
        fundo_municipal: contrato.fundo_municipal || [],
        status: contrato.status || 'Ativo' // Adicionar status com fallback para 'Ativo'
      })) || [];

      // Processar dados das ordens
      const ordensProcessadas = ordens?.map(ordem => ({
        ...ordem,
        data_emissao: parseDatabaseDate(ordem.data_emissao),
        created_at: parseDatabaseDate(ordem.created_at)
      })) || [];

      // Calcular estatísticas
      const totalContratos = contratosProcessados.length;
      const contratosAVencer = contratosProcessados.filter(c => {
        if (!c.data_termino) return false;
        const hoje = new Date();
        const dataTermino = new Date(c.data_termino);
        const diffTime = dataTermino.getTime() - hoje.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
      }).length;

      const totalFornecedores = fornecedoresCount || 0;
      const ordensPendentes = ordensProcessadas.filter(o => o.status === "Pendente").length;

      // Dados para gráficos
      const statusContratosData = [
        { name: "Ativo", value: contratosProcessados.length, color: "#10b981" }, // Todos os contratos são considerados ativos
        { name: "Expirado", value: 0, color: "#ef4444" }, // Campo status não existe na view
        { name: "A Vencer", value: contratosAVencer, color: "#f59e0b" } // Calculado baseado na data
      ];

      const ordensData = [
        { name: "Pendente", value: ordensProcessadas.filter(o => o.status === "Pendente").length },
        { name: "Concluída", value: ordensProcessadas.filter(o => o.status === "Concluída").length }
      ];

      // Contratos recentes (TODOS os contratos)
      const contratosRecentes = contratosProcessados.map(contrato => ({
        id: contrato.id,
        numero: contrato.numero,
        objeto: contrato.objeto,
        fornecedor: contrato.fornecedor_nome ? { nome: contrato.fornecedor_nome } : undefined,
        valor: contrato.valor,
        data_inicio: contrato.data_inicio,
        data_termino: contrato.data_termino,
        status: contrato.status // Incluir o status
      }));



      // Ordens pendentes (últimas 5)
      const ordensPendentesLista = ordensProcessadas
        .filter(o => o.status === "Pendente")
        .slice(0, 5);

      // Usar itens em alerta do hook especializado
      const totalItensAlerta = itensAlerta.length;

      setData({
        totalContratos,
        contratosAVencer,
        totalFornecedores,
        ordensPendentes,
        statusContratosData,
        ordensData,
        contratosRecentes,
        ordensPendentesLista,
        itensAlerta, // Usar os itens reais do hook
        fornecedores: fornecedores || []
      });

    } catch (error: any) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast({
        title: "Erro ao carregar dashboard",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [itensAlerta]); // Adicionar itensAlerta como dependência

  return {
    data,
    loading: loading || loadingItensAlerta,
    refetch: fetchDashboardData
  };
};
