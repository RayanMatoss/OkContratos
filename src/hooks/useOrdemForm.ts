import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrdemFornecimento } from "@/types";
import { useOrdemItems } from "./ordens/useOrdemItems";
import { useOrdemContratos } from "./ordens/useOrdemContratos";
import { useOrdemNumero } from "./ordens/useOrdemNumero";

export const useOrdemForm = (
  onSuccess?: () => void,
  initialOrdem?: OrdemFornecimento,
  mode: 'create' | 'edit' = 'create'
) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Date | undefined>(
    initialOrdem ? new Date(initialOrdem.dataEmissao) : new Date()
  );
  const [contratoId, setContratoId] = useState(initialOrdem?.contratoId || "");

  const { numero, setNumero, loadingNumero } = useOrdemNumero(mode, initialOrdem?.numero);
  const { contratos } = useOrdemContratos();
  const { contratoItems, selectedItems, setSelectedItems, updateConsumedItems } = useOrdemItems(
    contratoId,
    mode,
    initialOrdem?.id
  );

  useEffect(() => {
    if (mode === 'edit' && initialOrdem) {
      setContratoId(initialOrdem.contratoId);
    }
  }, [mode, initialOrdem]);

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
      if (mode === 'create') {
        await createOrdem();
      } else if (mode === 'edit' && initialOrdem) {
        await updateOrdem(initialOrdem.id);
      }

      toast({
        title: mode === 'create' ? "Ordem de Fornecimento criada" : "Ordem de Fornecimento atualizada",
        description: mode === 'create' ? "A ordem foi criada com sucesso" : "A ordem foi atualizada com sucesso",
      });

      if (onSuccess) onSuccess();
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
        // Status is now managed by triggers, no need to set it here
      })
      .select("id")
      .single();

    if (ordemError) {
      if (ordemError.code === '23505') {
        toast({
          title: "Número já existe",
          description: "Este número de ordem já está em uso. Um novo número será sugerido.",
          variant: "destructive",
        });
        await useOrdemNumero().fetchNextNumero();
        throw new Error("Este número de ordem já está em uso");
      }
      throw ordemError;
    }

    if (selectedItems.length > 0) {
      const itensConsumidos = selectedItems.map(item => ({
        ordem_id: ordemData.id,
        item_id: item.itemId,
        quantidade: item.quantidade
      }));

      const { error: itensError } = await supabase
        .from("itens_consumidos")
        .insert(itensConsumidos);

      if (itensError) throw itensError;
    }
  };

  const updateOrdem = async (ordemId: string) => {
    const { error: ordemError } = await supabase
      .from("ordens")
      .update({
        data_emissao: data?.toISOString(),
        contrato_id: contratoId
        // Status is now managed by triggers, no need to update it here
      })
      .eq("id", ordemId);

    if (ordemError) {
      throw ordemError;
    }

    await updateConsumedItems(ordemId);
  };

  return {
    data,
    setData,
    numero,
    setNumero,
    contratos,
    contratoItems,
    contratoId,
    setContratoId,
    selectedItems,
    setSelectedItems,
    handleSubmit,
    loading,
    loadingNumero
  };
};
