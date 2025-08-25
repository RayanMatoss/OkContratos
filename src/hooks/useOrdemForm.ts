import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrdemFornecimento, Item } from "@/types";
import { useOrdemNumero } from "@/hooks/ordens/useOrdemNumero";

interface UseOrdemFormProps {
  mode: "create" | "edit";
  initialOrdem?: OrdemFornecimento;
  onSuccess?: () => void;
}

interface SelectedItem {
  itemId: string;
  quantidade: number;
}

export const useOrdemForm = ({ mode, initialOrdem, onSuccess }: UseOrdemFormProps) => {
  const { toast } = useToast();
  
  const { numero, setNumero, loadingNumero, fetchNextNumero } = useOrdemNumero(mode, initialOrdem?.numero || "");

  const [loading, setLoading] = useState(false);
  const [contratoId, setContratoId] = useState(initialOrdem?.contratoId || "");
  const [data, setData] = useState<Date | undefined>(initialOrdem?.dataEmissao || new Date());
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  
  // SOLUÇÃO DEFINITIVA: Função para selecionar primeiro contrato disponível
  const selectFirstContrato = (contratos: any[]) => {
    // SOLUÇÃO: NÃO selecionar automaticamente - deixar usuário escolher
    return;
  };

  // Gera automaticamente ao abrir em modo criação
  useEffect(() => {
    
    if (mode === "create" && !initialOrdem?.numero) {
      void fetchNextNumero();
    } else if (initialOrdem?.numero) {
    }
  }, [mode, initialOrdem?.numero, fetchNextNumero]);

  useEffect(() => {
    if (initialOrdem) {
      setContratoId(initialOrdem.contratoId);
      setData(initialOrdem.dataEmissao);
      setNumero(initialOrdem.numero);

      if (initialOrdem.itens) {
        setSelectedItems(
          initialOrdem.itens.map((item) => ({
            itemId: item.itemId,
            quantidade: item.quantidade,
          }))
        );
      }
    }
  }, [initialOrdem]);
  
  // SOLUÇÃO DEFINITIVA: useEffect para seleção automática quando contratos estiverem disponíveis
  useEffect(() => {
    // SOLUÇÃO: NÃO executar seleção automática para evitar problemas
  }, []); // Dependências vazias para executar apenas uma vez

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contratoId || !data || !numero) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (mode === "create") {
        await createOrdem();
      } else if (mode === "edit" && initialOrdem) {
        await updateOrdem(initialOrdem.id);
      }

      toast({
        title: mode === "create" ? "Ordem de Fornecimento criada" : "Ordem de Fornecimento atualizada",
        description: mode === "create" ? "A ordem foi criada com sucesso" : "A ordem foi atualizada com sucesso",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrdem = async () => {
    const { data: ordemData, error: ordemError } = await supabase
      .from("ordens")
      .insert({
        contrato_id: contratoId,
        data_emissao: data?.toISOString(),
        numero,
      })
      .select("id")
      .single();

    if (ordemError) {
      if (ordemError.code === "23505") {
        toast({
          title: "Número já existe",
          description: "Este número de ordem já está em uso. Um novo número será sugerido.",
          variant: "destructive",
        });
        await fetchNextNumero();
        throw new Error("Este número de ordem já está em uso");
      }
      throw ordemError;
    }

    if (selectedItems.length > 0) {
      const itensConsumidos = selectedItems.map((item) => ({
        ordem_id: ordemData.id,
        item_id: item.itemId,
        quantidade: item.quantidade,
      }));

      const { error: itensError } = await supabase.from("itens_consumidos").insert(itensConsumidos);
      if (itensError) throw itensError;
    }
  };

  const updateOrdem = async (ordemId: string) => {
    const { error: ordemError } = await supabase
      .from("ordens")
      .update({
        contrato_id: contratoId,
        data_emissao: data?.toISOString(),
        numero,
      })
      .eq("id", ordemId);

    if (ordemError) throw ordemError;

    if (selectedItems.length > 0) {
      const { error: deleteError } = await supabase.from("itens_consumidos").delete().eq("ordem_id", ordemId);
      if (deleteError) throw deleteError;

      const itensConsumidos = selectedItems.map((item) => ({
        ordem_id: ordemId,
        item_id: item.itemId,
        quantidade: item.quantidade,
      }));

      const { error: itensError } = await supabase.from("itens_consumidos").insert(itensConsumidos);
      if (itensError) throw itensError;
    }
  };

  const addItem = (item: Item, quantidade: number) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.itemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.itemId === item.id ? { ...i, quantidade: i.quantidade + quantidade } : i
        );
      }
      return [...prev, { itemId: item.id, quantidade }];
    });
  };

  const removeItem = (itemId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantidade: number) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, quantidade } : i))
    );
  };

  return {
    loading,
    contratoId,
    setContratoId,
    data,
    setData,
    numero,
    setNumero,
    selectedItems,
    addItem,
    removeItem,
    updateItemQuantity,
    handleSubmit,
    selectFirstContrato, // SOLUÇÃO DEFINITIVA: Expor função para seleção automática
  };
};


