import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface OrdemExistente {
  id: string;
  numero: string;
  data_emissao: string;
  contrato_id: string;
}

export function useOrdensExistentes() {
  const { toast } = useToast();
  const [ordens, setOrdens] = useState<OrdemExistente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdens = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("ordens")
        .select("id, numero, data_emissao, contrato_id")
        .order("numero", { ascending: false });

      if (error) {
        throw error;
      }
      
      setOrdens(data || []);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
      toast({
        title: "Erro ao carregar ordens",
        description: msg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getNextNumero = useCallback((ano?: number) => {
    try {
      const anoAtual = ano || new Date().getFullYear();
      
      // Filtrar apenas ordens do ano especificado
      const ordensAno = ordens.filter(ordem => 
        ordem.numero && ordem.numero.includes(`/${anoAtual}`)
      );

      if (ordensAno.length === 0) {
        const numeroInicial = `0001/${anoAtual}`;
        return numeroInicial;
      }

      // Extrair números das ordens existentes
      const numeros = ordensAno
        .map(ordem => {
          const match = ordem.numero.match(/^(\d+)\/\d+$/);
          const num = match ? parseInt(match[1], 10) : 0;
          return num;
        })
        .filter(num => !isNaN(num) && num > 0);

      if (numeros.length === 0) {
        const numeroInicial = `0001/${anoAtual}`;
        return numeroInicial;
      }

      // Encontrar o maior número e incrementar
      const maiorNumero = Math.max(...numeros);
      const proximoNumero = maiorNumero + 1;
      const numeroFormatado = proximoNumero.toString().padStart(4, '0') + `/${anoAtual}`;
      
      return numeroFormatado;
    } catch (error) {
      console.warn("Erro ao gerar próximo número:", error);
      // Fallback em caso de erro
      const anoAtual = ano || new Date().getFullYear();
      return `0001/${anoAtual}`;
    }
  }, [ordens]);

  const getOrdensByAno = useCallback((ano: number) => {
    return ordens.filter(ordem => 
      ordem.numero && ordem.numero.includes(`/${ano}`)
    );
  }, [ordens]);

  const getOrdensByContrato = useCallback((contratoId: string) => {
    return ordens.filter(ordem => ordem.contrato_id === contratoId);
  }, [ordens]);

  // Carregar ordens ao inicializar
  useEffect(() => {
    void fetchOrdens();
  }, [fetchOrdens]);

  return {
    ordens,
    loading,
    error,
    fetchOrdens,
    getNextNumero,
    getOrdensByAno,
    getOrdensByContrato,
    refresh: fetchOrdens
  };
} 