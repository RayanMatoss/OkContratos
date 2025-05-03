<<<<<<< HEAD
=======

>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935
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
    
<<<<<<< HEAD
    if (!contratoId || !data) {
=======
    if (!contratoId || !data || !numero) {
>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935
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
<<<<<<< HEAD
        title: "Ordem criada com sucesso!",
        description: `Número da ordem: ${numero}`,
        variant: "default",
=======
        title: mode === 'create' ? "Ordem de Fornecimento criada" : "Ordem de Fornecimento atualizada",
        description: mode === 'create' ? "A ordem foi criada com sucesso" : "A ordem foi atualizada com sucesso",
>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935
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
<<<<<<< HEAD
        numero: numero,
        status: "pendente"
      })
      .select("id, numero")
=======
        numero,
        // Status is now managed by triggers, no need to set it here
      })
      .select("id")
>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935
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
<<<<<<< HEAD
      })
      .eq("id", ordemId);
=======
        // Status is now managed by triggers, no need to update it here
      })
      .eq("id", ordemId)
      .eq("status", "Pendente"); // Can only update pending orders
>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935

    if (ordemError) {
      throw ordemError;
    }

    await updateConsumedItems(ordemId);
  };

<<<<<<< HEAD
  const deleteOrdem = async (ordemId: string) => {
    await supabase
      .from('itens_consumidos')
      .delete()
      .eq('ordem_id', ordemId);

    await supabase
      .from('ordens')
      .delete()
      .eq('id', ordemId);
  };

=======
>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935
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
<<<<<<< HEAD
    loadingNumero,
    deleteOrdem
=======
    loadingNumero
>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935
  };
};
