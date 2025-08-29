export interface TimbreConfig {
  url: string;
  posicao: 'top-right' | 'top-left' | 'center-top' | 'header';
  tamanho: { width: number; height: number };
}

export interface TimbreSecretaria {
  [key: string]: TimbreConfig;
}

export const TIMBRE_CONFIG = {
  // Timbre padrão da prefeitura
  prefeitura: {
    url: "/Timbres/Prefeitura/prefeitura.png",
    posicao: 'center-top' as const, // Centralizado por padrão
    tamanho: { width: 160, height: 50 } // Largura aumentada
  },
  
  // Timbres por secretaria
  secretarias: {
    saude: {
      url: "/Timbres/Saude/saude.png",
      posicao: 'center-top' as const, // Centralizado por padrão
      tamanho: { width: 160, height: 50 } // Largura aumentada
    },
    educacao: {
      url: "/Timbres/Educação/educação.png",
      posicao: 'center-top' as const, // Centralizado por padrão
      tamanho: { width: 160, height: 50 } // Largura aumentada
    },
    assistencia: {
      url: "/Timbres/Assistencia/assitencia.png",
      posicao: 'center-top' as const, // Centralizado por padrão
      tamanho: { width: 160, height: 50 } // Largura aumentada
    },
    // Mapeamento para "ASSISTÊNCIA SOCIAL"
    'assistencia social': {
      url: "/Timbres/Assistencia/assitencia.png",
      posicao: 'center-top' as const,
      tamanho: { width: 160, height: 50 }
    }
  } as TimbreSecretaria,
  
  // Posições disponíveis com coordenadas
  posicoes: {
    'top-right': { x: 140, y: 10 },
    'top-left': { x: 15, y: 10 },
    'center-top': { x: 75, y: 10 },
    'header': { x: 15, y: 5 }
  }
};

// Função para obter configuração do timbre por secretaria
export function getTimbreConfig(secretaria?: string): TimbreConfig {
  if (!secretaria) {
    return TIMBRE_CONFIG.prefeitura;
  }
  
  const secretariaLower = secretaria.toLowerCase();
  
  // Mapeamento específico para "ASSISTÊNCIA SOCIAL"
  if (secretariaLower === 'assistencia social' || secretariaLower === 'assistência social') {
    return TIMBRE_CONFIG.secretarias.assistencia;
  }
  
  // Verificar se existe timbre específico para a secretaria
  if (TIMBRE_CONFIG.secretarias[secretariaLower]) {
    return TIMBRE_CONFIG.secretarias[secretariaLower];
  }
  
  // Retornar timbre padrão da prefeitura se não encontrar
  return TIMBRE_CONFIG.prefeitura;
}

// Função para obter lista de secretarias disponíveis
export function getSecretariasDisponiveis(): string[] {
  return Object.keys(TIMBRE_CONFIG.secretarias);
}

// Função para validar se um timbre existe
export function timbreExiste(secretaria: string): boolean {
  const secretariaLower = secretaria.toLowerCase();
  return secretariaLower === 'prefeitura' || 
         secretariaLower in TIMBRE_CONFIG.secretarias;
} 