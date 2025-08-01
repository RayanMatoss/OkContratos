import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface MunicipioGuardProps {
  children: React.ReactNode;
}

export const MunicipioGuard = ({ children }: MunicipioGuardProps) => {
  const { municipio, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !municipio) {
      navigate('/login');
    }
  }, [municipio, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!municipio) {
    return null;
  }

  return <>{children}</>;
}; 