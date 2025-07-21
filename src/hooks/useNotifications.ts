
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'contrato' | 'ordem' | 'sistema';
  lida: boolean;
  created_at: string;
}

export function useNotifications() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!session?.user,
  });

  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase
      .channel('notificacoes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notificacoes',
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user, refetch]);

  useEffect(() => {
    const count = notifications.filter(n => !n.lida).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notificacoes')
      .update({ lida: true })
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida",
        variant: "destructive",
      });
    } else {
      refetch();
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('notificacoes')
      .update({ lida: true })
      .eq('lida', false);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível marcar as notificações como lidas",
        variant: "destructive",
      });
    } else {
      refetch();
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
