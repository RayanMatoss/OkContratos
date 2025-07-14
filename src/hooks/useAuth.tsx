
import { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
// Remover importação de mockData
// import { usuarios, municipios } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  municipio: any | null;
  perfil: string | null;
  login: (email: string, password: string, municipioId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [municipio, setMunicipio] = useState<any | null>(null);
  const [perfil, setPerfil] = useState<string | null>(null);
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
      // Autentica no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) {
        setLoading(false);
        return false;
      }

      setUser(data.user); // Garante atualização do contexto

      // Busca o perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('municipio_id, permissao')
        .eq('user_id', data.user.id)
        .single();

      if (profileError || !profile) {
        setLoading(false);
        return false;
      }

      // Verifica se o município bate
      if ((profile as any).municipio_id !== municipioId) {
        setLoading(false);
        return false;
      }

      setPerfil((profile as any).permissao || null);
      localStorage.setItem('perfil', (profile as any).permissao || '');

      // Busca os dados do município
      const { data: municipio, error: municipioError } = await supabase
        .from('municipios')
        .select('id, nome, uf')
        .eq('id', municipioId)
        .single();
      setMunicipio(municipio);
      localStorage.setItem('municipio', JSON.stringify(municipio));
      setLoading(false);
      return true;
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

  // Carregar município e perfil do localStorage ao inicializar
  useEffect(() => {
    const savedMunicipio = localStorage.getItem('municipio');
    if (savedMunicipio) {
      setMunicipio(JSON.parse(savedMunicipio));
    }
    const savedPerfil = localStorage.getItem('perfil');
    if (savedPerfil) {
      setPerfil(savedPerfil);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, municipio, perfil, login, logout }}>
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
