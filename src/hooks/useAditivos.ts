
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
    try {
      // CORREÇÃO: Agora usando a view vw_aditivos_completos que foi criada
      const { data, error } = await supabase
        .from("vw_aditivos_completos")
        .select("*")
        .eq("contrato_id", contratoId)
        .order("criado_em", { ascending: false });

      if (error) throw error;
      
      // Mapear dados da view para a interface Aditivo
      const formattedAditivos: Aditivo[] = (data || []).map(item => ({
        id: item.id,
        contrato_id: item.contrato_id,
        tipo: item.tipo as TipoAditivo,
        nova_data_termino: item.nova_data_termino,
        percentual_itens: item.percentual_itens,
        aplicar_todos_itens: item.aplicar_todos_itens || true,
        percentuais_por_item: item.percentuais_por_item || {},
        criado_em: item.criado_em || new Date().toISOString()
      }));
      
      setAditivos(formattedAditivos);
      
      // Debug: logar aditivos encontrados
      console.log(`Aditivos encontrados para contrato ${contratoId}:`, formattedAditivos);
      
    } catch (error: any) {
      console.error('Erro ao buscar aditivos:', error);
      toast({ 
        title: "Erro ao buscar aditivos", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar novo aditivo
  const criarAditivo = async (aditivo: Omit<Aditivo, "id" | "criado_em">) => {
    setLoading(true);
    try {
      // Preparar dados para inserção na tabela aditivos
      const aditivoParaInserir = {
        contrato_id: aditivo.contrato_id,
        tipo: aditivo.tipo,
        nova_data_termino: aditivo.nova_data_termino,
        percentual_itens: aditivo.percentual_itens,
        // Incluir campos adicionais se existirem na tabela
        ...(aditivo.aplicar_todos_itens !== undefined && { aplicar_todos_itens: aditivo.aplicar_todos_itens }),
        ...(aditivo.percentuais_por_item && { percentuais_por_item: aditivo.percentuais_por_item })
      };

      console.log('Inserindo aditivo:', aditivoParaInserir);

      const { data, error } = await supabase
        .from("aditivos")
        .insert([aditivoParaInserir])
        .select()
        .single();

      if (error) throw error;

      console.log('Aditivo criado com sucesso:', data);

      toast({ 
        title: "Aditivo criado", 
        description: "Aditivo criado e aplicado com sucesso!" 
      });
      
      // Recarregar lista de aditivos
      await fetchAditivos();
      return true;
    } catch (error: any) {
      console.error('Erro ao criar aditivo:', error);
      toast({ 
        title: "Erro ao criar aditivo", 
        description: error.message, 
        variant: "destructive" 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Deletar aditivo
  const deletarAditivo = async (aditivoId: string) => {
    try {
      const { error } = await supabase
        .from("aditivos")
        .delete()
        .eq("id", aditivoId);

      if (error) throw error;

      toast({ 
        title: "Aditivo removido", 
        description: "Aditivo removido com sucesso!" 
      });
      
      // Recarregar lista de aditivos
      await fetchAditivos();
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar aditivo:', error);
      toast({ 
        title: "Erro ao remover aditivo", 
        description: error.message, 
        variant: "destructive" 
      });
      return false;
    }
  };

  return { 
    aditivos, 
    loading, 
    fetchAditivos, 
    criarAditivo, 
    deletarAditivo 
  };
}
