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
      
      // Buscar contratos usando a nova view com numeração completa
      const { data, error } = await supabase
        .from("vw_contratos_completos")
        .select(`
          *,
          itens(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedContratos: Contrato[] = data.map(contrato => {
        
        // Usar dados da nova view
        const fornecedores = [{
          id: contrato.fornecedor_id,
          nome: contrato.fornecedor_nome,
          cnpj: contrato.fornecedor_cnpj,
          email: "",
          telefone: "",
          endereco: "",
          createdAt: new Date()
        }];
        const fornecedorIds = [contrato.fornecedor_id];

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

        const fundoMunicipal = parseFundoMunicipal(contrato.fundo_municipal);

        return {
          id: contrato.id,
          numero: contrato.numero,
          sufixo: contrato.sufixo,
          numeroCompleto: contrato.numero_completo,
          contratoBaseId: contrato.contrato_base_id,
          fornecedorIds: fornecedorIds,
          fundoMunicipal: fundoMunicipal,
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

  // Função para atualizar contratos existentes com fundos do usuário
  const atualizarContratosComFundos = async (fundosUsuario: string[]) => {
    try {
      // Buscar contratos que não têm fundos associados
      const { data: contratosSemFundos, error } = await supabase
        .from("contratos")
        .select("id, fundo_municipal")
        .or("fundo_municipal.is.null,fundo_municipal.eq.[]");

      if (error) throw error;

      if (contratosSemFundos && contratosSemFundos.length > 0) {
        // Atualizar contratos sem fundos
        const { error: updateError } = await supabase
          .from("contratos")
          .update({ fundo_municipal: fundosUsuario })
          .in("id", contratosSemFundos.map(c => c.id));

        if (updateError) throw updateError;

        // Recarregar contratos
        await fetchContratos();
      }
    } catch (error: any) {
      console.error("Erro ao atualizar contratos com fundos:", error);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  return { contratos, loading, fetchContratos, atualizarContratosComFundos };
};
