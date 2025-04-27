
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Item, OrdemFornecimento } from "@/types";

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
  const [numero, setNumero] = useState(initialOrdem?.numero || "");
  const [contratos, setContratos] = useState<any[]>([]);
  const [contratoItems, setContratoItems] = useState<Item[]>([]);
  const [contratoId, setContratoId] = useState(initialOrdem?.contratoId || "");
  const [selectedItems, setSelectedItems] = useState<{itemId: string; quantidade: number}[]>([]);
  const [loadingNumero, setLoadingNumero] = useState(mode === 'create');
  const [originalItemsConsumidos, setOriginalItemsConsumidos] = useState<{
    id: string;
    itemId: string;
    quantidade: number;
  }[]>([]);

  useEffect(() => {
    fetchContratos();
    
    if (mode === 'create') {
      fetchNextNumero();
    }
  }, [mode]);

  // Add effect to fetch contract items when contratoId changes
  useEffect(() => {
    if (contratoId) {
      fetchContratoItems();
      
      // If in edit mode, fetch the consumed items
      if (mode === 'edit' && initialOrdem) {
        fetchConsumedItems();
      }
    } else {
      setContratoItems([]);
      setSelectedItems([]);
    }
  }, [contratoId, mode, initialOrdem]);

  const fetchConsumedItems = async () => {
    if (!initialOrdem) return;

    try {
      const { data, error } = await supabase
        .from("itens_consumidos")
        .select("id, item_id, quantidade")
        .eq("ordem_id", initialOrdem.id);

      if (error) throw error;

      const consumedItems = (data || []).map(item => ({
        id: item.id,
        itemId: item.item_id,
        quantidade: item.quantidade
      }));

      setOriginalItemsConsumidos(consumedItems);
      setSelectedItems(consumedItems.map(item => ({
        itemId: item.itemId,
        quantidade: item.quantidade
      })));
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar itens consumidos: " + error.message,
        variant: "destructive",
      });
    }
  };

  const fetchNextNumero = async () => {
    setLoadingNumero(true);
    try {
      const { data, error } = await supabase
        .rpc('get_next_ordem_numero');

      if (error) throw error;
      setNumero(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao gerar próximo número da ordem",
        variant: "destructive",
      });
    } finally {
      setLoadingNumero(false);
    }
  };

  const fetchContratos = async () => {
    const { data, error } = await supabase
      .from("contratos")
      .select("id, numero, objeto, fornecedor_id, fornecedores(nome)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar contratos",
        variant: "destructive",
      });
      return;
    }

    setContratos(data || []);
  };

  const fetchContratoItems = async () => {
    try {
      const { data, error } = await supabase
        .from("itens")
        .select("*")
        .eq("contrato_id", contratoId);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar itens do contrato",
          variant: "destructive",
        });
        return;
      }

      const transformedItems: Item[] = (data || []).map(item => ({
        id: item.id,
        contratoId: item.contrato_id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        valorUnitario: item.valor_unitario,
        unidade: item.unidade,
        quantidadeConsumida: item.quantidade_consumida
      }));

      setContratoItems(transformedItems);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
      })
      .select("id")
      .single();

    if (ordemError) {
      if (ordemError.code === '23505') { // Unique violation
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
    // Update basic order info
    const { error: ordemError } = await supabase
      .from("ordens")
      .update({
        data_emissao: data?.toISOString(),
        contrato_id: contratoId
        // Don't update numero or status here
      })
      .eq("id", ordemId)
      .eq("status", "Pendente"); // Only allow updating pending orders

    if (ordemError) {
      throw ordemError;
    }

    // Handle item updates by finding differences
    const itemsToAdd: {ordem_id: string; item_id: string; quantidade: number}[] = [];
    const itemsToUpdate: {id: string; quantidade: number}[] = [];
    const itemsToDelete: string[] = [];

    // Find items to create or update
    selectedItems.forEach(newItem => {
      const originalItem = originalItemsConsumidos.find(oi => oi.itemId === newItem.itemId);
      
      if (!originalItem) {
        // New item to add
        itemsToAdd.push({
          ordem_id: ordemId,
          item_id: newItem.itemId,
          quantidade: newItem.quantidade
        });
      } else if (originalItem.quantidade !== newItem.quantidade) {
        // Item to update
        itemsToUpdate.push({
          id: originalItem.id,
          quantidade: newItem.quantidade
        });
      }
    });

    // Find items to delete
    originalItemsConsumidos.forEach(originalItem => {
      const stillExists = selectedItems.some(si => si.itemId === originalItem.itemId);
      if (!stillExists) {
        itemsToDelete.push(originalItem.id);
      }
    });

    // Execute the changes
    if (itemsToAdd.length > 0) {
      const { error: addError } = await supabase
        .from("itens_consumidos")
        .insert(itemsToAdd);
      
      if (addError) throw addError;
    }

    // Update items one by one to ensure triggers run properly
    for (const item of itemsToUpdate) {
      const { error: updateError } = await supabase
        .from("itens_consumidos")
        .update({ quantidade: item.quantidade })
        .eq("id", item.id);
      
      if (updateError) throw updateError;
    }

    if (itemsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("itens_consumidos")
        .delete()
        .in("id", itemsToDelete);
      
      if (deleteError) throw deleteError;
    }
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
