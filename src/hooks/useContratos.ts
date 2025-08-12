import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRetry } from "@/hooks/useRetry";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, FundoMunicipal } from "@/types";
import { parseDatabaseDate, debugCompleteDateConversion, testDateRoundTrip } from "@/lib/dateUtils";

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
            .from("vw_contratos_completos")
            .select(`
              *,
              itens(*)
            `)
            .order('created_at', { ascending: false });

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
            console.log("Contratos carregados com sucesso após retry");
          }
        }
      );

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
          dataInicio: (() => {
            // DEBUG: Log das datas para identificar problema de 1 dia a menos
            console.log(`🔍 DEBUG DATAS - Contrato ${contrato.numero}:`);
            console.log(`   📅 data_inicio original: "${contrato.data_inicio}"`);
            const parsed = parseDatabaseDate(contrato.data_inicio);
            console.log(`   🔧 data_inicio convertida: ${parsed}`);
            if (parsed) {
              console.log(`   📝 data_inicio formatada: ${parsed.toLocaleDateString('pt-BR')}`);
            }
            return parsed || new Date();
          })(),
          dataTermino: (() => {
            // DEBUG: Log das datas para identificar problema de 1 dia a menos
            console.log(`   📅 data_termino original: "${contrato.data_termino}"`);
            const parsed = parseDatabaseDate(contrato.data_termino);
            console.log(`   🔧 data_termino convertida: ${parsed}`);
            if (parsed) {
              console.log(`   📝 data_termino formatada: ${parsed.toLocaleDateString('pt-BR')}`);
            }
            return parsed || new Date();
          })(),
          status: contrato.status as any,
          createdAt: (() => {
            // DEBUG: Log das datas para identificar problema de 1 dia a menos
            console.log(`   📅 created_at original: "${contrato.created_at}"`);
            const parsed = parseDatabaseDate(contrato.created_at);
            console.log(`   🔧 created_at convertida: ${parsed}`);
            if (parsed) {
              console.log(`   📝 created_at formatada: ${parsed.toLocaleDateString('pt-BR')}`);
            }
            return parsed || new Date();
          })(),
          fornecedores: fornecedores,
          itens: itens
        };
      });

      setContratos(formattedContratos);
    } catch (error: any) {
      console.error('Erro ao carregar contratos:', error);
      
      // Definir mensagem de erro mais amigável
      let errorMessage = 'Erro ao carregar contratos';
      
      if (error.message.includes('Serviço temporariamente indisponível')) {
        errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
      } else if (error.message.includes('Timeout na conexão')) {
        errorMessage = 'Problema de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message.includes('Erro de autenticação')) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão com o servidor. Verifique sua internet.';
      } else {
        errorMessage = error.message || 'Erro inesperado ao carregar contratos';
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erro ao carregar contratos",
        description: errorMessage,
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

  return { contratos, loading, error, fetchContratos, atualizarContratosComFundos };
};
