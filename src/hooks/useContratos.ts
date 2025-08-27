import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRetry } from "@/hooks/useRetry";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, FundoMunicipal } from "@/types";
import { parseDatabaseDate } from "@/lib/dateUtils";

export const useContratos = () => {
  const { toast } = useToast();
  const { retryWithBackoff } = useRetry();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFundoMunicipal = (fundoMunicipal: any): FundoMunicipal[] => {
    if (Array.isArray(fundoMunicipal)) {
      return fundoMunicipal;
    }
    return [];
  };

  const fetchContratos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar retry com backoff para buscar contratos
      const data = await retryWithBackoff(
        async () => {
          const { data, error } = await supabase
            .from("vw_contratos_limpos")
            .select("*")
            .order('numero', { ascending: false }); // Usar numero em vez de created_at

          if (error) {
            // Tratar erros específicos
            if (error.code === '503') {
              throw new Error('Serviço temporariamente indisponível. Tente novamente em alguns instantes.');
            } else if (error.code === 'PGRST301') {
              throw new Error('Timeout na conexão. Verifique sua conexão com a internet.');
            } else if (error.code === 'PGRST116') {
              throw new Error('Erro de autenticação. Faça login novamente.');
            }
            throw error;
          }

          return data;
        },
        {
          maxRetries: 3,
          baseDelay: 1000,
          onRetry: (attempt, error) => {
            console.log(`Tentativa ${attempt} falhou:`, error.message);
            toast({
              title: `Tentativa ${attempt} falhou`,
              description: "Tentando novamente...",
              variant: "default"
            });
          },
          onSuccess: () => {
            // Retry bem-sucedido
          }
        }
      );

      if (!data) {
        setContratos([]);
        return;
      }

      // Processar e formatar os contratos
      const formattedContratos: Contrato[] = data.map((contrato: any) => {
        // Processar fundos municipais
        const fundosMunicipais = contrato.fundo_municipal ? parseFundoMunicipal(contrato.fundo_municipal) : [];
        
        // Processar fornecedores da nova view (estrutura simplificada)
        const fornecedorId = contrato.fornecedor_id;
        const fornecedorNome = contrato.fornecedor_nome;
        
        // Criar array de fornecedores com a estrutura esperada
        const fornecedores = fornecedorId ? [{
          id: fornecedorId,
          nome: fornecedorNome || 'Nome não disponível',
          cnpj: '', // Campo não disponível na nova view
          email: '', // Campo não disponível na nova view
          telefone: '', // Campo não disponível na nova view
          endereco: '', // Campo não disponível na nova view
          createdAt: new Date() // Campo não disponível na nova view
        }] : [];
        
        const fornecedorIds = fornecedores.map(f => f.id);

        // Processar itens da view (array JSON) - pode não existir na nova view
        const itens = contrato.itens ? contrato.itens.map((item: any) => ({
          id: item.id || '',
          contratoId: contrato.id || '',
          descricao: item.descricao || '',
          quantidade: item.quantidade ? parseFloat(item.quantidade) : 0,
          unidade: item.unidade || '',
          valorUnitario: item.valor_unitario ? parseFloat(item.valor_unitario) : 0,
          quantidadeConsumida: item.quantidade_consumida ? parseFloat(item.quantidade_consumida) : 0,
          createdAt: new Date(),
          fundos: item.fundos || []
        })) : []; // Retornar array vazio se não houver itens na view

        return {
          id: contrato.id || '',
          numero: contrato.numero || '',
          fornecedorIds: fornecedorIds || [],
          fornecedores: fornecedores || [],
          fundoMunicipal: fundosMunicipais || [],
          objeto: contrato.objeto || '',
          valor: contrato.valor ? parseFloat(contrato.valor) : 0,
          dataInicio: contrato.data_inicio ? parseDatabaseDate(contrato.data_inicio) : new Date(),
          dataTermino: contrato.data_termino ? parseDatabaseDate(contrato.data_termino) : new Date(),
          status: 'Ativo', // Valor padrão já que a view não tem esse campo
          createdAt: new Date(),
          itens: itens || []
        };
      });

      setContratos(formattedContratos);
      setError(null);
    } catch (error: any) {
      console.error('Erro ao buscar contratos:', error);
      setError(error.message);
      toast({
        title: "Erro ao carregar contratos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createContrato = async (contratoData: Partial<Contrato>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("contratos")
        .insert({
          numero: contratoData.numero,
          fornecedor_id: contratoData.fornecedorIds?.[0], // Assumindo primeiro fornecedor
          fundo_municipal: contratoData.fundoMunicipal,
          objeto: contratoData.objeto,
          valor: contratoData.valor,
          data_inicio: contratoData.dataInicio?.toISOString(),
          data_termino: contratoData.dataTermino?.toISOString(),
          status: contratoData.status || "Ativo"
        })
        .select()
        .single();

      if (error) throw error;

      // Recarregar contratos após criação
      await fetchContratos();

      toast({
        title: "Contrato criado",
        description: "Contrato criado com sucesso!",
        variant: "default"
      });

      return data;
    } catch (error: any) {
      console.error('Erro ao criar contrato:', error);
      setError(error.message);
      toast({
        title: "Erro ao criar contrato",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateContrato = async (id: string, contratoData: Partial<Contrato>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("contratos")
        .update({
          numero: contratoData.numero,
          fornecedor_id: contratoData.fornecedorIds?.[0],
          fundo_municipal: contratoData.fundoMunicipal,
          objeto: contratoData.objeto,
          valor: contratoData.valor,
          data_inicio: contratoData.dataInicio?.toISOString(),
          data_termino: contratoData.dataTermino?.toISOString(),
          status: contratoData.status
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Recarregar contratos após atualização
      await fetchContratos();

      toast({
        title: "Contrato atualizado",
        description: "Contrato atualizado com sucesso!",
        variant: "default"
      });

      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar contrato:', error);
      setError(error.message);
      toast({
        title: "Erro ao atualizar contrato",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteContrato = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("contratos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Recarregar contratos após exclusão
      await fetchContratos();

      toast({
        title: "Contrato excluído",
        description: "Contrato excluído com sucesso!",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Erro ao excluir contrato:', error);
      setError(error.message);
      toast({
        title: "Erro ao excluir contrato",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  return {
    contratos,
    loading,
    error,
    fetchContratos,
    createContrato,
    updateContrato,
    deleteContrato
  };
};
