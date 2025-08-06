import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DashboardData {
  totalContratos: number;
  contratosAVencer: number;
  totalFornecedores: number;
  ordensPendentes: number;
  statusContratosData: { name: string; value: number; color: string }[];
  ordensData: { name: string; value: number }[];
  contratosRecentes: any[];
  ordensPendentesLista: any[];
  itensAlerta: any[];
  fornecedores: any[]; // ADICIONADO
}

export const useDashboardData = () => {
  const { toast } = useToast();
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
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch contratos with fornecedor
      const { data: contratos, error: contratosError } = await supabase
        .from("contratos")
        .select(`
          *,
          fornecedor:fornecedor_id (
            nome
          )
        `)
        .order('created_at', { ascending: false });

      if (contratosError) throw contratosError;

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

      // Fetch fornecedores count
      const { count: fornecedoresCount, error: fornecedoresError } = await supabase
        .from("fornecedores")
        .select('*', { count: "exact" });
      if (fornecedoresError) throw fornecedoresError;

      // Fetch todos os fornecedores
      const { data: fornecedores, error: fornecedoresListError } = await supabase
        .from("fornecedores")
        .select("*");
      if (fornecedoresListError) throw fornecedoresListError;

      // Calculate dashboard metrics
      const now = new Date();
      const contratosAVencer = contratos?.filter(c => {
        const dataTermino = new Date(c.data_termino);
        const diffDays = Math.ceil((dataTermino.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diffDays <= 30 && diffDays > 0;
      }).length || 0;

      const ordensPendentes = ordens?.filter(o => o.status === 'Pendente').length || 0;

      // Calculate status counts for contratos
      const statusContratosData = [
        { 
          name: "Ativos", 
          value: contratos?.filter(c => c.status === "Ativo").length || 0,
          color: "#10B981" 
        },
        { 
          name: "A Vencer", 
          value: contratos?.filter(c => c.status === "A Vencer").length || 0,
          color: "#F59E0B"
        },
        { 
          name: "Expirados", 
          value: contratos?.filter(c => c.status === "Expirado").length || 0,
          color: "#EF4444"
        },
      ];

      // Get recent contratos
      const contratosRecentes = contratos?.slice(0, 5).map(c => ({
        ...c,
        fornecedor: c.fornecedor
      })) || [];

      // Get pending ordens
      const ordensPendentesLista = ordens
        ?.filter(o => o.status === "Pendente")
        .slice(0, 5)
        .map(o => ({
          ...o,
          contrato: o.contrato
        })) || [];

      // Group ordens by month
      const ordensData: { name: string; value: number }[] = [];
      if (ordens) {
        const ordensMap = new Map();
        ordens.forEach(ordem => {
          const date = new Date(ordem.created_at);
          const key = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
          ordensMap.set(key, (ordensMap.get(key) || 0) + 1);
        });
        
        Array.from(ordensMap.entries())
          .sort()
          .slice(-6)
          .forEach(([month, count]) => {
            ordensData.push({ name: month, value: count as number });
          });
      }

      // Buscar itens em alerta (consumo > 90%)
      const { data: itensAlerta, error: itensAlertaError } = await supabase
        .from('itens')
        .select(`
          *,
          contratos (
            numero,
            fornecedores ( nome )
          )
        `)
        .gte('quantidade', 1)
        .filter('quantidade_consumida', 'gte', 0);

      if (itensAlertaError) throw itensAlertaError;
      const itensAlertaFiltrados = (itensAlerta || []).filter(item =>
        item.quantidade > 0 && item.quantidade_consumida / item.quantidade >= 0.9
      );

      setData({
        totalContratos: contratos.length,
        contratosAVencer,
        totalFornecedores: fornecedoresCount || 0,
        ordensPendentes,
        statusContratosData,
        ordensData,
        contratosRecentes: contratos.slice(0, 10),
        ordensPendentesLista,
        itensAlerta: itensAlertaFiltrados,
        fornecedores: fornecedores || [], // ADICIONADO
      });

    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { data, loading, refetch: fetchDashboardData };
};
