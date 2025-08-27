import { useState, useEffect } from 'react';
import { AlertCircle, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

export const ConnectionStatus = () => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkConnection = async () => {
    try {
      setStatus('checking');
      
      // Tentar uma query simples para verificar a conexão
      const { error } = await supabase
        .from('contratos')
        .select('id')
        .limit(1);
      
      if (error) {
        setStatus('disconnected');
      } else {
        setStatus('connected');
      }
      
      setLastCheck(new Date());
    } catch (error) {
      setStatus('disconnected');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Verificar conexão a cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Conectado',
          variant: 'default' as const,
          color: 'text-green-600'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-4 h-4" />,
          text: 'Desconectado',
          variant: 'destructive' as const,
          color: 'text-red-600'
        };
      case 'checking':
        return {
          icon: <Wifi className="w-4 h-4 animate-pulse" />,
          text: 'Verificando...',
          variant: 'secondary' as const,
          color: 'text-yellow-600'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="flex items-center gap-2">
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        {statusInfo.icon}
        <span className={statusInfo.color}>{statusInfo.text}</span>
      </Badge>
      
      {status === 'disconnected' && (
        <button
          onClick={checkConnection}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Tentar reconectar
        </button>
      )}
      
      <span className="text-xs text-muted-foreground">
        Última verificação: {lastCheck.toLocaleTimeString('pt-BR')}
      </span>
    </div>
  );
}; 