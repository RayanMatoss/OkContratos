import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrdemFornecimento, Item, ItemOrdem } from "@/types";
import { useCriarSolicitacao } from "./useCriarSolicitacao";

export interface UseOrdemFormProps {
  mode: 'create' | 'edit';
  initialOrdem?: OrdemFornecimento;
  onSuccess?: () => void;
}

export const useOrdemForm = ({ mode, initialOrdem, onSuccess }: UseOrdemFormProps) => {
  const { toast } = useToast();
  const { criar, loading: rpcLoading, error: rpcError } = useCriarSolicitacao();
  
  const [contratoId, setContratoId] = useState<string>("");
  const [data, setData] = useState<Date | undefined>(new Date());
  const [numero, setNumero] = useState<string>("");
  const [justificativa, setJustificativa] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantidade: number }[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contratoId || !data || !justificativa.trim() || selectedItems.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        // Obter usuário logado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        // Buscar perfil do usuário para obter secretaria
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("fundo_municipal")
          .eq("user_id", user.id)
          .single();

        if (!profile?.fundo_municipal || profile.fundo_municipal.length === 0) {
          throw new Error("Secretaria não definida para o usuário");
        }

        const secretaria = profile.fundo_municipal[0] as string;

        // Calcular quantidade total
        const quantidadeTotal = selectedItems.reduce((total, item) => total + item.quantidade, 0);

        // Criar solicitação usando o novo hook
        const result = await criar({
          contrato_id: contratoId,
          solicitante: user.id,
          secretaria,
          justificativa: justificativa.trim(),
          quantidade: quantidadeTotal
        });

        if (result.success) {
          toast({
            title: "Solicitação criada",
            description: "Sua solicitação foi enviada e está aguardando aprovação",
          });

          // Limpar formulário
          setContratoId("");
          setData(new Date());
          setNumero("");
          setJustificativa("");
          setSelectedItems([]);

          onSuccess?.();
        } else {
          throw new Error(result.error || "Erro desconhecido ao criar solicitação");
        }
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
      
      toast({
        title: "Erro ao processar solicitação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    loading: loading || rpcLoading,
    selectFirstContrato,
    addItem,
    removeItem,
    updateItemQuantity,
  };
};


