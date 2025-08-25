import { useState, useCallback } from "react";
import { useOrdensExistentes } from "./useOrdensExistentes";
import { useToast } from "@/hooks/use-toast";

export function useOrdemNumeroManager() {
  const { getNextNumero, getOrdensByAno, refresh } = useOrdensExistentes();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNextNumero = useCallback(async (ano?: number) => {
    setIsGenerating(true);
    try {
      // Recarregar ordens para garantir dados atualizados
      await refresh();
      
      // Gerar próximo número
      const proximoNumero = getNextNumero(ano);
      
      if (!proximoNumero) {
        throw new Error("Não foi possível gerar o próximo número");
      }
      
      return proximoNumero;
    } catch (error) {
      console.warn("Erro ao gerar número da ordem:", error);
      
      // Em caso de erro, gerar número padrão
      const anoAtual = ano || new Date().getFullYear();
      const numeroPadrao = `0001/${anoAtual}`;
      
      toast({
        title: "Aviso",
        description: "Usando número padrão devido a erro na consulta.",
        variant: "default",
      });
      
      return numeroPadrao;
    } finally {
      setIsGenerating(false);
    }
  }, [getNextNumero, refresh, toast]);

  const validateNumero = useCallback((numero: string) => {
    // Validar formato: 0001/2025
    const regex = /^\d{4}\/\d{4}$/;
    if (!regex.test(numero)) {
      return {
        isValid: false,
        message: "Formato inválido. Use: 0001/2025"
      };
    }

    const [num, ano] = numero.split('/');
    const numInt = parseInt(num, 10);
    const anoInt = parseInt(ano, 10);
    const anoAtual = new Date().getFullYear();

    if (numInt < 1 || numInt > 9999) {
      return {
        isValid: false,
        message: "Número deve estar entre 0001 e 9999"
      };
    }

    if (anoInt < 2000 || anoInt > anoAtual + 10) {
      return {
        isValid: false,
        message: `Ano deve estar entre 2000 e ${anoAtual + 10}`
      };
    }

    return {
      isValid: true,
      message: "Número válido"
    };
  }, []);

  const getOrdensAno = useCallback((ano: number) => {
    return getOrdensByAno(ano);
  }, [getOrdensByAno]);

  const checkNumeroDisponivel = useCallback((numero: string) => {
    const ordensAno = getOrdensByAno(parseInt(numero.split('/')[1], 10));
    return !ordensAno.some(ordem => ordem.numero === numero);
  }, [getOrdensByAno]);

  return {
    generateNextNumero,
    validateNumero,
    getOrdensAno,
    checkNumeroDisponivel,
    isGenerating,
    refresh
  };
} 