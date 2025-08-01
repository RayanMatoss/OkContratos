
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
    
    const formattedAditivos: Aditivo[] = (data || []).map(item => ({
      id: item.id,
      contrato_id: item.contrato_id,
      tipo: item.tipo as TipoAditivo,
      nova_data_termino: item.nova_data_termino,
      percentual_itens: item.percentual_itens,
      criado_em: item.criado_em
    }));
    
    setAditivos(formattedAditivos);
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

    // Lógica para aplicar o aditivo usando funções SQL otimizadas
    if (aditivo.tipo === "periodo" && aditivo.nova_data_termino) {
      await supabase.from("contratos").update({ data_termino: aditivo.nova_data_termino }).eq("id", aditivo.contrato_id);
    }

    if (aditivo.tipo === "valor" && aditivo.percentual_itens) {
      // Usar função SQL otimizada em vez do loop
      try {
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/rpc/aplicar_aditivo_valor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'apikey': supabase.supabaseKey
          },
          body: JSON.stringify({
            p_contrato_id: aditivo.contrato_id,
            p_percentual: aditivo.percentual_itens
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao aplicar aditivo');
        }
      } catch (error: any) {
        toast({ title: "Erro ao aplicar aditivo", description: error.message, variant: "destructive" });
        return false;
      }
    }

    toast({ title: "Aditivo criado", description: "Aditivo criado com sucesso." });
    fetchAditivos();
    return true;
  };

  return { aditivos, loading, fetchAditivos, criarAditivo };
}
