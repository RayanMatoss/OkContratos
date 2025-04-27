
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato } from "@/types";

export const useContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(false);

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

      const formattedContratos: Contrato[] = data.map(contrato => ({
        id: contrato.id,
        numero: contrato.numero,
        fornecedorId: contrato.fornecedor_id,
        fundoMunicipal: contrato.fundo_municipal as any,
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

  return { contratos, loading, fetchContratos };
};
