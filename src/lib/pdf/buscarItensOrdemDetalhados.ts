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
      item: item_id (
        descricao,
        unidade,
        valor_unitario,
        contrato_id
      )
    `)
    .eq("ordem_id", ordemId);

  if (error) throw error;

  // Filtrar apenas itens que pertencem ao contrato da ordem
  const itensFiltrados = (data || []).filter(ic => 
    ic.item?.contrato_id === ordem.contrato_id
  );

  // Mapear e retornar os itens
  const itensProcessados = itensFiltrados.map(ic => ({
    descricao: ic.item?.descricao || "Item não encontrado",
    quantidade: ic.quantidade || 0,
    unidade: ic.item?.unidade || "UN",
    valor_unitario: ic.item?.valor_unitario || 0
  }));

  return itensProcessados;
} 