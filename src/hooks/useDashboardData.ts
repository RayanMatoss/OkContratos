import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseDatabaseDate } from "@/lib/dateUtils";

interface DashboardData {
  totalContratos: number;
  contratosAVencer: number;
  totalFornecedores: number;
  ordensPendentes: number;
  statusContratosData: { name: string; value: number; color: string }[];
  ordensData: { name: string; value: number }[];
  contratosRecentes: any[];
  ordensPendentesLista: any[];
<<<<<<< HEAD
<<<<<<< HEAD
  itensAlerta: any[];
  fornecedores: any[]; // ADICIONADO
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
  itensAlerta: any[];
  fornecedores: any[]; // ADICIONADO
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
<<<<<<< HEAD
    ordensPendentesLista: [],
    itensAlerta: [],
    fornecedores: []
=======
    ordensPendentesLista: []
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
    ordensPendentesLista: [],
    itensAlerta: [],
    fornecedores: []
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
      if (fornecedoresError) throw fornecedoresError;

      // Fetch todos os fornecedores
      const { data: fornecedores, error: fornecedoresListError } = await supabase
        .from("fornecedores")
        .select("*");
      if (fornecedoresListError) throw fornecedoresListError;
<<<<<<< HEAD
=======

      if (fornecedoresError) throw fornecedoresError;
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

      // Calculate dashboard metrics
      const now = new Date();
      // Definir a variável local contratosAVencer corretamente
      const contratosAVencer = (data.contratosRecentes || []).filter((contrato: any) => {
        if (!contrato.data_termino) return false;
        const dataTermino = parseDatabaseDate(contrato.data_termino) || new Date();
        const now = new Date();
        const diffDays = Math.ceil((dataTermino.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diffDays <= 30 && diffDays > 0;
      });

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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
=======
      setData({
        totalContratos: contratos?.length || 0,
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        contratosAVencer,
        totalFornecedores: fornecedoresCount || 0,
        ordensPendentes,
        statusContratosData,
        ordensData,
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        contratosRecentes: contratos.slice(0, 10),
        ordensPendentesLista,
        itensAlerta: itensAlertaFiltrados,
        fornecedores: fornecedores || [], // ADICIONADO
<<<<<<< HEAD
=======
        contratosRecentes,
        ordensPendentesLista
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
