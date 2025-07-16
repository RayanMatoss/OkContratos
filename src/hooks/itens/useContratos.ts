import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, FundoMunicipal } from "@/types";

export const useContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContratos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contratos")
        .select(`
          *,
          fornecedor:fornecedor_id(nome)
        `);

      if (error) throw error;

      const formattedContratos = data.map(contrato => ({
        id: contrato.id,
        numero: contrato.numero,
        fornecedorId: contrato.fornecedor_id,
        fornecedor: {
          nome: contrato.fornecedor?.nome || ''
        },
        fundoMunicipal: Array.isArray(contrato.fundo_municipal) 
          ? contrato.fundo_municipal 
          : [],
        objeto: contrato.objeto,
        valor: contrato.valor,
        dataInicio: new Date(contrato.data_inicio),
        dataTermino: new Date(contrato.data_termino),
        status: contrato.status,
        createdAt: new Date(contrato.created_at),
        itens: []
      }));

      setContratos(formattedContratos);
    } catch (error: any) {
      console.error('Erro ao buscar contratos:', error);
    } finally {
      setLoading(false);
    }
  };

  return { contratos, loading, fetchContratos };
};
