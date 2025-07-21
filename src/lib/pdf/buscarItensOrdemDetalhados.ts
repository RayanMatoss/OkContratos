import { supabase } from "@/integrations/supabase/client";

export async function buscarItensOrdemDetalhados(ordemId: string) {
  const { data, error } = await supabase
    .from("itens_consumidos")
    .select(`
      quantidade,
      item: item_id (
        descricao,
        unidade,
        valor_unitario
      )
    `)
    .eq("ordem_id", ordemId);

  if (error) throw error;

  return (data || []).map(ic => ({
    descricao: ic.item?.descricao,
    quantidade: ic.quantidade,
    unidade: ic.item?.unidade,
    valor_unitario: ic.item?.valor_unitario
  }));
} 