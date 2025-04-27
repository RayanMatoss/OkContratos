import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Item } from "@/types";

export const useOrdemForm = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Date | undefined>(new Date());
  const [numero, setNumero] = useState("");
  const [contratos, setContratos] = useState<any[]>([]);
  const [contratoItems, setContratoItems] = useState<Item[]>([]);
  const [contratoId, setContratoId] = useState("");
  const [selectedItems, setSelectedItems] = useState<{itemId: string; quantidade: number}[]>([]);
  const [loadingNumero, setLoadingNumero] = useState(true);

  useEffect(() => {
    fetchContratos();
    fetchNextNumero();
  }, []);

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
      const { data: ordemData, error: ordemError } = await supabase
        .from("ordens")
        .insert({
          contrato_id: contratoId,
          data_emissao: data.toISOString(),
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
          return;
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

      toast({
        title: "Ordem de Fornecimento criada",
        description: "A ordem foi criada com sucesso",
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
