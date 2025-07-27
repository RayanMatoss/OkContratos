import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, FundoMunicipal } from "@/types";

export const useContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(false);

  const parseFundoMunicipal = (fundo: string[] | string | null | undefined): FundoMunicipal[] => {
    if (Array.isArray(fundo)) return fundo as FundoMunicipal[];
    if (!fundo) return [];
    if (typeof fundo === 'string' && fundo.includes(',')) {
      return fundo.split(', ')
        .map(item => item.trim())
        .filter(Boolean) as FundoMunicipal[];
    }
    if (typeof fundo === 'string' && fundo.trim() !== '') {
      return [fundo.trim() as FundoMunicipal];
    }
    return [];
  };

  const fetchContratos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contratos")
        .select(`
          *,
          fornecedor:fornecedor_id(
            id,
            nome,
            cnpj,
            email,
            telefone,
            endereco
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Dados brutos do Supabase:', data);

      const formattedContratos: Contrato[] = data.map(contrato => ({
        id: contrato.id,
        numero: contrato.numero,
        fornecedorId: contrato.fornecedor_id,
        fundoMunicipal: parseFundoMunicipal(contrato.fundo_municipal),
        objeto: contrato.objeto,
        valor: contrato.valor,
        dataInicio: new Date(contrato.data_inicio),
        dataTermino: new Date(contrato.data_termino),
        status: contrato.status as any,
        createdAt: new Date(contrato.created_at),
        fornecedor: contrato.fornecedor ? {
          id: contrato.fornecedor.id,
          nome: contrato.fornecedor.nome,
          cnpj: contrato.fornecedor.cnpj,
          email: contrato.fornecedor.email || "",
          telefone: contrato.fornecedor.telefone || "",
          endereco: contrato.fornecedor.endereco || "",
          createdAt: new Date() // Since the fornecedor data from API doesn't include created_at
        } : undefined,
        itens: []
      }));

      console.log('Contratos formatados:', formattedContratos);

      setContratos(formattedContratos);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar contratos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContrato = async (id: string, data: Partial<Omit<Contrato, 'id' | 'createdAt' | 'status'>>) => {
    try {
      // Convert fundoMunicipal array to array format for database
      const fundoMunicipalValue = Array.isArray(data.fundoMunicipal) && data.fundoMunicipal.length > 0
        ? data.fundoMunicipal
        : [];

      const { error } = await supabase
        .from('contratos')
        .update({
          numero: data.numero,
          fornecedor_id: data.fornecedorId,
          fundo_municipal: fundoMunicipalValue,
          objeto: data.objeto,
          valor: data.valor,
          data_inicio: data.dataInicio?.toISOString(),
          data_termino: data.dataTermino?.toISOString(),
        })
        .eq('id', id)
        .neq('status', 'Expirado');

      if (error) throw error;

      await fetchContratos();
      toast({
        title: "Contrato atualizado",
        description: "O contrato foi atualizado com sucesso",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar contrato",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteContrato = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id)
        .neq('status', 'Expirado');

      if (error) throw error;

      await fetchContratos();
      toast({
        title: "Contrato excluído",
        description: "O contrato foi excluído com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir contrato",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchContratos();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:contratos')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'contratos' 
        }, 
        () => {
          fetchContratos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { contratos, loading, fetchContratos, deleteContrato, updateContrato };
};
