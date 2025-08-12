import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, FundoMunicipal } from "@/types";
import { parseDatabaseDate } from "@/lib/dateUtils";

export const useContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContratos = async () => {
    try {
      setLoading(true);
      
      // Buscar contratos com fornecedores usando a nova estrutura
      const { data, error } = await supabase
        .from("contratos")
        .select(`
          *,
          contrato_fornecedores(
            fornecedor_id,
            fornecedores(
              id,
              nome,
              cnpj,
              email,
              telefone,
              endereco
            )
          ),
          itens(
            id,
            descricao,
            quantidade,
            unidade,
            valor_unitario,
            quantidade_consumida,
            fundos,
            created_at
          )
        `);

      if (error) throw error;

      const formattedContratos = data.map(contrato => {
        // Extrair fornecedores do relacionamento
        const fornecedores = contrato.contrato_fornecedores?.map((cf: any) => ({
          id: cf.fornecedores.id,
          nome: cf.fornecedores.nome,
          cnpj: cf.fornecedores.cnpj,
          email: cf.fornecedores.email || "",
          telefone: cf.fornecedores.telefone || "",
          endereco: cf.fornecedores.endereco || "",
          createdAt: new Date()
        })) || [];

        const fornecedorIds = fornecedores.map(f => f.id);

        // Extrair itens do contrato
        const itens = contrato.itens?.map((item: any) => ({
          id: item.id,
          contratoId: contrato.id,
          descricao: item.descricao,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valorUnitario: item.valor_unitario,
          quantidadeConsumida: item.quantidade_consumida || 0,
          createdAt: parseDatabaseDate(item.created_at) || new Date(),
          fundos: item.fundos || []
        })) || [];

        return {
          id: contrato.id,
          numero: contrato.numero,
          fornecedorIds: fornecedorIds,
          fornecedores: fornecedores,
          fundoMunicipal: Array.isArray(contrato.fundo_municipal) 
            ? contrato.fundo_municipal 
            : [],
          objeto: contrato.objeto,
          valor: contrato.valor,
          dataInicio: parseDatabaseDate(contrato.data_inicio) || new Date(),
          dataTermino: parseDatabaseDate(contrato.data_termino) || new Date(),
          status: contrato.status,
          createdAt: parseDatabaseDate(contrato.created_at) || new Date(),
          itens: itens
        };
      });

      setContratos(formattedContratos);
    } catch (error: any) {
      console.error('Erro ao buscar contratos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  return { contratos, loading, fetchContratos };
};
