import { useCallback } from 'react';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  onRetry?: (attempt: number, error: any) => void;
  onSuccess?: () => void;
  onFinalError?: (error: any) => void;
}

export const useRetry = () => {
  const retryWithBackoff = useCallback(async <T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      onRetry,
      onSuccess,
      onFinalError
    } = options;

    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        
        // Se chegou até aqui, foi bem-sucedido
        if (onSuccess) {
          onSuccess();
        }
        
        return result;
      } catch (error: any) {
        lastError = error;
        
        // Se for o último tentativa, não esperar
        if (attempt === maxRetries) {
          if (onFinalError) {
            onFinalError(error);
          }
          throw error;
        }
        
        // Notificar sobre a tentativa
        if (onRetry) {
          onRetry(attempt + 1, error);
        }
        
        // Calcular delay com backoff exponencial
        const delay = baseDelay * Math.pow(2, attempt);
        
        // Aguardar antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }, []);

  const retryWithFixedDelay = useCallback(async <T>(
    fn: () => Promise<T>,
    options: RetryOptions & { fixedDelay?: number } = {}
  ): Promise<T> => {
    const {
      maxRetries = 3,
      fixedDelay = 1000,
      onRetry,
      onSuccess,
      onFinalError
    } = options;

    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        
        if (onSuccess) {
          onSuccess();
        }
        
        return result;
      } catch (error: any) {
        lastError = error;
        
        if (attempt === maxRetries) {
          if (onFinalError) {
            onFinalError(error);
          }
          throw error;
        }
        
        if (onRetry) {
          onRetry(attempt + 1, error);
        }
        
        // Aguardar com delay fixo
        await new Promise(resolve => setTimeout(resolve, fixedDelay));
      }
    }
    
    throw lastError;
  }, []);

  return {
    retryWithBackoff,
    retryWithFixedDelay
  };
}; 