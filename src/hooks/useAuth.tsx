
import { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { usuarios, municipios } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  municipio: any | null;
  login: (email: string, password: string, municipioId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [municipio, setMunicipio] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, municipioId: string) => {
    setLoading(true);
    
    try {
      // Simulação de login com verificação de município
      const user = usuarios.find(u => u.email === email);
      const selectedMunicipio = municipios.find(m => m.id === municipioId);
      
      if (user && password === "senha123" && selectedMunicipio) {
        // Verificar se o usuário tem acesso ao município selecionado
        if (user.municipioId === municipioId) {
          setMunicipio(selectedMunicipio);
          // Salvar no localStorage para persistir
          localStorage.setItem('municipio', JSON.stringify(selectedMunicipio));
          setLoading(false);
          return true;
        } else {
          setLoading(false);
          return false;
        }
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setSession(null);
    setMunicipio(null);
    localStorage.removeItem('municipio');
    navigate('/login');
  };

  // Carregar município do localStorage ao inicializar
  useEffect(() => {
    const savedMunicipio = localStorage.getItem('municipio');
    if (savedMunicipio) {
      setMunicipio(JSON.parse(savedMunicipio));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, municipio, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
