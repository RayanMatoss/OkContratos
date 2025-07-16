
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, FundoMunicipal } from "@/types";

export const useContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<Contrato[]>([]);

  const fetchContratos = async () => {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('id, numero, objeto, fornecedor_id, fornecedores (id, nome, cnpj, email, telefone, endereco, created_at), fundo_municipal, valor, data_inicio, data_termino, status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the Contrato type
      const formattedContratos: Contrato[] = data.map(contrato => ({
        id: contrato.id,
        numero: contrato.numero,
        fornecedorId: contrato.fornecedor_id,
        fornecedor: contrato.fornecedores ? {
          id: contrato.fornecedores.id,
          nome: contrato.fornecedores.nome,
          cnpj: contrato.fornecedores.cnpj,
          email: contrato.fornecedores.email || "",
          telefone: contrato.fornecedores.telefone || "",
          endereco: contrato.fornecedores.endereco || "",
          createdAt: new Date(contrato.fornecedores.created_at)
        } : undefined,
        fundoMunicipal: Array.isArray(contrato.fundo_municipal) ? contrato.fundo_municipal as FundoMunicipal[] : [],
        objeto: contrato.objeto,
        valor: contrato.valor,
        dataInicio: new Date(contrato.data_inicio),
        dataTermino: new Date(contrato.data_termino),
        status: contrato.status as any,
        createdAt: new Date(contrato.created_at),
        itens: []
      }));
      
      setContratos(formattedContratos);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  return { contratos, fetchContratos };
};
