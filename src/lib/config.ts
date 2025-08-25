// Configurações de timeout e retry para a aplicação
export const APP_CONFIG = {
  // Configurações de retry
  retry: {
    maxRetries: 3,
    baseDelay: 1000, // 1 segundo
    maxDelay: 10000, // 10 segundos
  },
  
  // Timeouts para diferentes operações
  timeouts: {
    // Timeout para operações de leitura (SELECT)
    read: 30000, // 30 segundos
    
    // Timeout para operações de escrita (INSERT, UPDATE, DELETE)
    write: 60000, // 60 segundos
    
    // Timeout para operações de autenticação
    auth: 15000, // 15 segundos
    
    // Timeout para operações de upload/download
    file: 120000, // 2 minutos
  },
  
  // Configurações de cache
  cache: {
    // Tempo de vida do cache em milissegundos
    ttl: 5 * 60 * 1000, // 5 minutos
    
    // Tamanho máximo do cache
    maxSize: 100,
  },
  
  // Configurações de notificação
  notifications: {
    // Tempo para mostrar notificações de sucesso
    successDuration: 3000, // 3 segundos
    
    // Tempo para mostrar notificações de erro
    errorDuration: 5000, // 5 segundos
    
    // Tempo para mostrar notificações de warning
    warningDuration: 4000, // 4 segundos
  },
  
  // Configurações de paginação
  pagination: {
    // Número padrão de itens por página
    defaultPageSize: 20,
    
    // Opções de tamanho de página
    pageSizeOptions: [10, 20, 50, 100],
  },
  
  // Configurações de busca
  search: {
    // Delay mínimo para executar busca (debounce)
    debounceDelay: 300, // 300ms
    
    // Número mínimo de caracteres para executar busca
    minCharacters: 2,
  }
};

// Configurações específicas para diferentes ambientes
export const ENV_CONFIG = {
  development: {
    ...APP_CONFIG,
    retry: {
      ...APP_CONFIG.retry,
      maxRetries: 2, // Menos retries em desenvolvimento
    },
    timeouts: {
      ...APP_CONFIG.timeouts,
      read: 15000, // Timeout menor em desenvolvimento
    }
  },
  
  production: {
    ...APP_CONFIG,
    retry: {
      ...APP_CONFIG.retry,
      maxRetries: 5, // Mais retries em produção
      baseDelay: 2000, // Delay maior em produção
    }
  }
};

// Função para obter configuração baseada no ambiente
export const getConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || APP_CONFIG;
}; 