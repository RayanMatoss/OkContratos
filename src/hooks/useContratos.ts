import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, FundoMunicipal } from "@/types";

export const useContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(false);

  const parseFundoMunicipal = (fundoMunicipal: any): FundoMunicipal[] => {
    if (Array.isArray(fundoMunicipal)) {
      return fundoMunicipal;
    }
    return [];
  };

  const fetchContratos = async () => {
    try {
      setLoading(true);
      
      // Buscar contratos com fornecedores e itens
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
          ),
          itens(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedContratos: Contrato[] = data.map(contrato => {
        let fornecedores: any[] = [];
        let fornecedorIds: string[] = [];

        // Verificar se há fornecedor
        if (contrato.fornecedor) {
          fornecedores = [{
            id: contrato.fornecedor.id,
            nome: contrato.fornecedor.nome,
            cnpj: contrato.fornecedor.cnpj,
            email: contrato.fornecedor.email || "",
            telefone: contrato.fornecedor.telefone || "",
            endereco: contrato.fornecedor.endereco || "",
            createdAt: new Date()
          }];
          fornecedorIds = [contrato.fornecedor.id];
        }

        // Extrair itens do contrato
        const itens = contrato.itens?.map((item: any) => ({
          id: item.id,
          contratoId: contrato.id,
          descricao: item.descricao,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valorUnitario: item.valor_unitario,
          quantidadeConsumida: item.quantidade_consumida || 0,
          createdAt: new Date(item.created_at),
          fundos: item.fundos || []
        })) || [];

        return {
          id: contrato.id,
          numero: contrato.numero,
          fornecedorIds: fornecedorIds,
          fundoMunicipal: parseFundoMunicipal(contrato.fundo_municipal),
          objeto: contrato.objeto,
          valor: contrato.valor,
          dataInicio: new Date(contrato.data_inicio),
          dataTermino: new Date(contrato.data_termino),
          status: contrato.status as any,
          createdAt: new Date(contrato.created_at),
          fornecedores: fornecedores,
          itens: itens
        };
      });

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
  }, []);

  return { contratos, loading, fetchContratos };
};
