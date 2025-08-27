import { supabase } from "@/integrations/supabase/client";

export async function buscarItensOrdemDetalhados(ordemId: string) {
  // Buscar a ordem para obter o contrato_id
  const { data: ordem, error: ordemError } = await supabase
    .from("ordens")
    .select("contrato_id")
    .eq("id", ordemId)
    .single();

  if (ordemError) throw ordemError;

  // Buscar itens consumidos da ordem específica
  const { data, error } = await supabase
    .from("itens_consumidos")
    .select(`
      quantidade,
      item_id
    `)
    .eq("ordem_id", ordemId);

  if (error) throw error;

  // Buscar os itens separadamente
  const itemIds = [...new Set(data?.map(ic => ic.item_id) || [])];
  let itensData: any[] = [];
  
  if (itemIds.length > 0) {
    const { data: itens, error: itensError } = await supabase
      .from("itens")
      .select(`
        id,
        descricao,
        unidade,
        valor_unitario,
        contrato_id
      `)
      .in("id", itemIds);
    
    if (itensError) throw itensError;
    itensData = itens || [];
  }

  // Filtrar apenas itens que pertencem ao contrato da ordem
  const itensFiltrados = (data || []).filter(ic => {
    const item = itensData.find(i => i.id === ic.item_id);
    return item?.contrato_id === ordem.contrato_id;
  });

  // Mapear e retornar os itens
  const itensProcessados = itensFiltrados.map(ic => {
    const item = itensData.find(i => i.id === ic.item_id);
    return {
      descricao: item?.descricao || "Item não encontrado",
      quantidade: ic.quantidade || 0,
      unidade: item?.unidade || "UN",
      valor_unitario: item?.valor_unitario || 0
    };
  });

  return itensProcessados;
} 