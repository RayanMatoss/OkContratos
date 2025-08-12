<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  const parseFundoMunicipal = (fundoMunicipal: any): FundoMunicipal[] => {
    if (Array.isArray(fundoMunicipal)) {
      return fundoMunicipal;
    }
<<<<<<< HEAD
=======
  const parseFundoMunicipal = (fundo: string | null | undefined): FundoMunicipal[] => {
    if (!fundo) return [];
    
    // Se for uma string com vírgula, divida em um array
    if (typeof fundo === 'string' && fundo.includes(',')) {
      return fundo.split(', ')
        .map(item => item.trim())
        .filter(Boolean) as FundoMunicipal[];
    }
    
    // Se for um único valor string
    if (typeof fundo === 'string' && fundo.trim() !== '') {
      return [fundo.trim() as FundoMunicipal];
    }
    
    // Caso não seja reconhecido, retorne array vazio
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
=======
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
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
=======
  const updateContrato = async (id: string, data: Partial<Omit<Contrato, 'id' | 'createdAt' | 'status'>>) => {
    try {
      // Convert fundoMunicipal array to string if it's an array
      const fundoMunicipalValue = Array.isArray(data.fundoMunicipal) && data.fundoMunicipal.length > 0
        ? data.fundoMunicipal.join(', ') 
        : '';

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
        .eq('status', 'Em Aprovação');

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
        .eq('status', 'Em Aprovação');

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
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    }
  };

  useEffect(() => {
    fetchContratos();
<<<<<<< HEAD
<<<<<<< HEAD
  }, []);

  return { contratos, loading, error, fetchContratos, atualizarContratosComFundos };
};
