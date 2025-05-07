import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Aditivo, TipoAditivo } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useAditivos(contratoId: string) {
  const { toast } = useToast();
  const [aditivos, setAditivos] = useState<Aditivo[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar aditivos do contrato
  const fetchAditivos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("aditivos")
      .select("*")
      .eq("contrato_id", contratoId)
      .order("criado_em", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao buscar aditivos", description: error.message, variant: "destructive" });
      return;
    }
    setAditivos(data || []);
  };

  // Criar novo aditivo e aplicar lógica
  const criarAditivo = async (aditivo: Omit<Aditivo, "id" | "criado_em">) => {
    setLoading(true);
    const { error } = await supabase.from("aditivos").insert([aditivo]);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao criar aditivo", description: error.message, variant: "destructive" });
      return false;
    }

    // Lógica para aplicar o aditivo
    if (aditivo.tipo === "periodo" && aditivo.nova_data_termino) {
      await supabase.from("contratos").update({ data_termino: aditivo.nova_data_termino }).eq("id", aditivo.contrato_id);
    }

    if (aditivo.tipo === "valor" && aditivo.percentual_itens) {
      // Buscar itens do contrato
      const { data: itens } = await supabase.from("itens").select("*").eq("contrato_id", aditivo.contrato_id);
      if (itens && itens.length > 0) {
        for (const item of itens) {
          const novaQuantidade = Math.round(item.quantidade * (1 + aditivo.percentual_itens / 100));
          await supabase.from("itens").update({ quantidade: novaQuantidade }).eq("id", item.id);
        }
      }
    }

    toast({ title: "Aditivo criado", description: "Aditivo criado com sucesso." });
    fetchAditivos();
    return true;
  };

  return { aditivos, loading, fetchAditivos, criarAditivo };
} 