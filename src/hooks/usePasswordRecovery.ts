import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PasswordRecoveryState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

interface UsePasswordRecoveryReturn {
  state: PasswordRecoveryState;
  sendRecoveryEmail: (email: string) => Promise<boolean>;
  resetPassword: (password: string) => Promise<boolean>;
  resetState: () => void;
}

export const usePasswordRecovery = (): UsePasswordRecoveryReturn => {
  const [state, setState] = useState<PasswordRecoveryState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const sendRecoveryEmail = async (email: string): Promise<boolean> => {
    setState({
      isLoading: true,
      error: null,
      success: false,
    });

    try {
      // Enviar email de recuperação
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) {
        setState({
          isLoading: false,
          error: error.message,
          success: false,
        });
        return false;
      }

      setState({
        isLoading: false,
        error: null,
        success: true,
      });

      return true;
    } catch (error) {
      setState({
        isLoading: false,
        error: 'Erro inesperado ao enviar email de recuperação.',
        success: false,
      });
      return false;
    }
  };

  const resetPassword = async (password: string): Promise<boolean> => {
    setState({
      isLoading: true,
      error: null,
      success: false,
    });

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setState({
          isLoading: false,
          error: error.message,
          success: false,
        });
        return false;
      }

      setState({
        isLoading: false,
        error: null,
        success: true,
      });

      return true;
    } catch (error) {
      setState({
        isLoading: false,
        error: 'Erro inesperado ao redefinir senha.',
        success: false,
      });
      return false;
    }
  };

  const resetState = () => {
    setState({
      isLoading: false,
      error: null,
      success: false,
    });
  };

  return {
    state,
    sendRecoveryEmail,
    resetPassword,
    resetState,
  };
}; 