import React from 'react';
import { useTimbreConfig } from './timbre-selector';

interface TimbrePreviewProps {
  secretaria?: string;
  className?: string;
}

export function TimbrePreview({ secretaria, className }: TimbrePreviewProps) {
  const { timbreConfig } = useTimbreConfig(secretaria);

  return (
    <div className={`flex flex-col items-center gap-2 p-3 border rounded-lg ${className}`}>
      <div className="text-sm font-medium text-muted-foreground">
        Preview do Timbre
      </div>
      
      <div className="relative border-2 border-dashed border-gray-300 rounded p-2 bg-gray-50">
        <img
          src={timbreConfig.url}
          alt={`Timbre ${secretaria || 'prefeitura'}`}
          className="max-w-full h-auto"
          style={{
            width: `${timbreConfig.tamanho.width}px`,
            height: `${timbreConfig.tamanho.height}px`
          }}
          onError={(e) => {
            // Fallback para imagem não encontrada
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            
            // Remover fallbacks anteriores
            const existingFallback = target.parentNode?.querySelector('.timbre-fallback');
            if (existingFallback) {
              existingFallback.remove();
            }
            
            const fallback = document.createElement('div');
            fallback.className = 'timbre-fallback flex items-center justify-center text-gray-400 text-xs bg-gray-100 rounded';
            fallback.style.width = `${timbreConfig.tamanho.width}px`;
            fallback.style.height = `${timbreConfig.tamanho.height}px`;
            fallback.innerHTML = `
              <div class="text-center">
                <div>❌</div>
                <div class="text-xs">Timbre não encontrado</div>
                <div class="text-xs">${timbreConfig.url}</div>
              </div>
            `;
            target.parentNode?.appendChild(fallback);
          }}
        />
      </div>
      
      <div className="text-xs text-center text-muted-foreground">
        <div>Posição: {timbreConfig.posicao}</div>
        <div>Tamanho: {timbreConfig.tamanho.width} x {timbreConfig.tamanho.height}px</div>
      </div>
    </div>
  );
} 