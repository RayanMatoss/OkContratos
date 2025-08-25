import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useOrdemNumeroManager } from "./useOrdemNumeroManager";

type Mode = "create" | "edit";

export function useOrdemNumero(mode: Mode = "create", initialNumero = "") {
  const { toast } = useToast();
  const { generateNextNumero, validateNumero, isGenerating } = useOrdemNumeroManager();
  const [numero, setNumero] = useState<string>(initialNumero);
  const [loadingNumero, setLoadingNumero] = useState<boolean>(mode === "create");
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  const fetchNextNumero = useCallback(async () => {
    if (mode !== "create" || hasGenerated) return initialNumero;
    
    setLoadingNumero(true);
    try {
      // Usar o manager para gerar o próximo número
      const proximoNumero = await generateNextNumero();
      
      setNumero(proximoNumero);
      setHasGenerated(true);
      return proximoNumero;

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      console.warn("Erro ao gerar número da ordem:", err);
      
      // Fallback em caso de erro
      const anoAtual = new Date().getFullYear();
      const numeroFallback = `0001/${anoAtual}`;
      setNumero(numeroFallback);
      setHasGenerated(true);
      
      toast({
        title: "Aviso",
        description: "Usando número padrão devido a erro na consulta.",
        variant: "default",
      });
      
      return numeroFallback;
    } finally {
      setLoadingNumero(false);
    }
  }, [generateNextNumero, mode, initialNumero, toast, hasGenerated]);

  const validateCurrentNumero = useCallback(() => {
    return validateNumero(numero);
  }, [validateNumero, numero]);

  // Gera automaticamente ao abrir em modo criação
  useEffect(() => {
    if (mode === "create" && !initialNumero && !hasGenerated) {
      void fetchNextNumero();
    } else if (initialNumero) {
      setNumero(initialNumero);
      setHasGenerated(true);
    }
  }, [mode, initialNumero, fetchNextNumero, hasGenerated]);

  return {
    numero,
    setNumero,
    loadingNumero: loadingNumero || isGenerating,
    fetchNextNumero,
    validateNumero: validateCurrentNumero,
  };
}

