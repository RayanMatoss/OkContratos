
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

      setContratos(data.map(contrato => ({
        ...contrato,
        dataInicio: new Date(contrato.data_inicio),
        dataTermino: new Date(contrato.data_termino),
        fornecedorId: contrato.fornecedor_id,
        fundoMunicipal: contrato.fundo_municipal,
        itens: []
      })));
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
