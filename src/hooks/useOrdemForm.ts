import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { OrdemFornecimento, Item, ItemOrdem } from "@/types";
import { criarOrdem, obterSecretariaUsuario } from "@/features/ordens/api/createSolicitacao";

export interface UseOrdemFormProps {
  mode: 'create' | 'edit';
  initialOrdem?: OrdemFornecimento;
  onSuccess?: () => void;
}

export const useOrdemForm = ({ mode, initialOrdem, onSuccess }: UseOrdemFormProps) => {
  const { toast } = useToast();
  const { secretariaAtiva } = useAuth();
  const [contratoId, setContratoId] = useState<string>("");
  const [data, setData] = useState<Date | undefined>(new Date());
  const [numero, setNumero] = useState<string>("");
  const [justificativa, setJustificativa] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantidade: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userFundos, setUserFundos] = useState<string[]>([]);
  const [requiresSecretariaSelection, setRequiresSecretariaSelection] = useState(false);
  const [selectedSecretaria, setSelectedSecretaria] = useState<string>(""); // sempre string

  // Buscar fundos do usuário ao inicializar
  useEffect(() => {
    const fetchUserFundos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: perfil } = await supabase
            .from('user_profiles')
            .select('fundo_municipal')
            .eq('user_id', user.id)
            .single();

          if (perfil?.fundo_municipal) {
            setUserFundos(perfil.fundo_municipal);
            // Se tem múltiplas secretarias e não tem uma selecionada, obrigar seleção
            if (perfil.fundo_municipal.length > 1 && !secretariaAtiva) {
              setRequiresSecretariaSelection(true);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar fundos do usuário:', error);
      }
    };

    fetchUserFundos();
  }, [secretariaAtiva]);

  // Para edição, preencher dados iniciais
  useEffect(() => {
    if (mode === 'edit' && initialOrdem) {
      setContratoId(initialOrdem.contratoId);
      setData(initialOrdem.dataEmissao);
      setNumero(initialOrdem.numero);
      setJustificativa(initialOrdem.justificativa || "");
      setSelectedItems(initialOrdem.itens.map(item => ({
        itemId: item.itemId,
        quantidade: item.quantidade
      })));
    }
  }, [mode, initialOrdem]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contratoId || !data || !justificativa.trim() || selectedItems.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Validar quantidades
    const invalidItems = selectedItems.filter(item => item.quantidade <= 0);
    if (invalidItems.length > 0) {
      toast({
        title: "Quantidades inválidas",
        description: "Todas as quantidades devem ser maiores que zero",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'create') {
        // Determinar secretaria a ser enviada
        let secretariaParaEnviar: string;

        // 1. Se o usuário selecionou explicitamente uma secretaria
        if (selectedSecretaria && selectedSecretaria.trim() !== '') {
          secretariaParaEnviar = selectedSecretaria;
        } else if (secretariaAtiva && secretariaAtiva.trim() !== '') {
          secretariaParaEnviar = secretariaAtiva;
        } else {
          // 2. Se não selecionou, tentar obter do perfil (apenas se houver 1 opção)
          const secretariaDoPerfil = await obterSecretariaUsuario();
          if (secretariaDoPerfil) {
            secretariaParaEnviar = secretariaDoPerfil;
          } else {
            // 3. Se não conseguiu determinar, bloquear submit
            toast({
              title: "Secretaria não selecionada",
              description: "Você possui múltiplas secretarias. Selecione uma na interface antes de continuar.",
              variant: "destructive",
            });
            return;
          }
        }

        // Toast de "Criando solicitação..."
        toast({
          title: "Criando solicitação...",
          description: "Aguarde enquanto processamos sua solicitação",
        });

        // Calcular quantidade total dos itens selecionados
        const quantidadeTotal = selectedItems.reduce((total, item) => total + item.quantidade, 0);

        // Montar payload para RPC
        const payload = {
          p_contrato_id: contratoId,
          p_justificativa: justificativa,
          p_quantidade: Number(quantidadeTotal),
          p_secretaria: secretariaParaEnviar, // string
        };

        console.log('payload/ordem', payload);

        // Chamar RPC create_solicitacao_ordem
        const { data: result, error } = await supabase.rpc('create_solicitacao_ordem', payload);

        if (error) {
          console.error('Erro ao criar ordem via RPC:', { error, payload });
          throw new Error(error.message || 'Erro ao criar solicitação');
        }

        // Verificar resposta da RPC
        if (!result?.success) {
          console.error('RPC retornou sucesso=false:', result);
          throw new Error(result?.message || 'Não foi possível criar a solicitação');
        }

        const ordemCriada = result;

        // Toast de "Adicionando itens..."
        toast({
          title: "Adicionando itens...",
          description: "Configurando os itens da solicitação",
        });

        // Adicionar itens diretamente na tabela
        const itensParaInserir = selectedItems.map(item => ({
          solicitacao_id: ordemCriada.id,
          item_id: item.itemId,
          quantidade: item.quantidade
        }));

        const { data: itensData, error: itensError } = await supabase
          .from('itens_solicitacao')
          .insert(itensParaInserir)
          .select('id');

        if (itensError) {
          throw new Error(`Erro ao adicionar itens: ${itensError.message}`);
        }

        if (!itensData || itensData.length === 0) {
          throw new Error('Solicitação criada, mas erro ao adicionar itens');
        }

        // Toast de sucesso
        toast({
          title: "Solicitação criada com sucesso!",
          description: "Sua solicitação foi enviada e está aguardando aprovação",
        });

        // Limpar formulário
        setContratoId("");
        setData(new Date());
        setNumero("");
        setJustificativa("");
        setSelectedItems([]);
        setSelectedSecretaria("");

        // Chamar callback de sucesso
        onSuccess?.();

      } else {
        // Para edição, ainda não implementado no novo sistema
        toast({
          title: "Funcionalidade não disponível",
          description: "A edição de solicitações ainda não foi implementada",
          variant: "destructive",
        });
        return;
      }
    } catch (error: any) {
      console.error("Erro ao processar solicitação:", error);
      
      // Tratamento específico para erros de secretaria
      if (error.message?.includes('P0001') || 
          error.message?.includes('Secretaria não definida') ||
          error.message?.includes('Selecione a secretaria') ||
          error.message?.includes('Escolha uma secretaria')) {
        toast({
          title: "Secretaria não definida",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Outros erros
        toast({
          title: "Erro ao processar solicitação",
          description: error.message || 'Erro desconhecido',
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }, [contratoId, data, justificativa, selectedItems, mode, onSuccess, toast, secretariaAtiva, selectedSecretaria]);

  const addItem = (item: Item, quantidade: number) => {
    const existingItemIndex = selectedItems.findIndex(selected => selected.itemId === item.id);
    
    if (existingItemIndex >= 0) {
      // Atualizar quantidade existente
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantidade = quantidade;
      setSelectedItems(updatedItems);
    } else {
      // Adicionar novo item
      setSelectedItems([...selectedItems, { itemId: item.id, quantidade }]);
    }
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.itemId !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantidade: number) => {
    const existingItemIndex = selectedItems.findIndex(selected => selected.itemId === itemId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantidade = quantidade;
      setSelectedItems(updatedItems);
    }
  };

  const selectFirstContrato = () => {
    // Implementar se necessário
  };

  return {
    contratoId,
    setContratoId,
    data,
    setData,
    numero,
    setNumero,
    justificativa,
    setJustificativa,
    selectedItems,
    handleSubmit,
    loading: loading || submitting,
    submitting,
    selectFirstContrato,
    addItem,
    removeItem,
    updateItemQuantity,
    userFundos,
    requiresSecretariaSelection,
    selectedSecretaria,
    setSelectedSecretaria,
  };
};


