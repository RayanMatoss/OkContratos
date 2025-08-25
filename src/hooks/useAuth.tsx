import { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Municipio { id: string; nome: string; uf: string }
interface UserProfile { municipio_id: string; permissao: string; fundo_municipal: string[] }

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  municipio: Municipio | null;
  perfil: string | null;
  fundosSelecionados: string[];
  secretariaAtiva: string | null;
  setSecretariaAtiva: (secretaria: string) => void;
  login: (username: string, password: string, municipioId: string, fundosSelecionados: string[]) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  const [perfil, setPerfil] = useState<string | null>(null);
  const [fundosSelecionados, setFundosSelecionados] = useState<string[]>([]);
  const [secretariaAtiva, setSecretariaAtiva] = useState<string | null>(null);
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

  const login = async (username: string, password: string, municipioId: string, fundosSelecionados: string[]) => {
    setLoading(true);
    try {
      // Primeiro, buscar o email pelo username
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_by_username', { p_username: username });

      if (userError || !userData || userData.length === 0) {
        setLoading(false);
        return false;
      }

      const userInfo = userData[0];
      const email = userInfo.email;

      // Autentica no Supabase usando o email encontrado
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) {
        setLoading(false);
        return false;
      }

      setUser(data.user); // Garante atualização do contexto

      // Verifica se o município bate
      if (userInfo.municipio_id !== municipioId) {
        setLoading(false);
        return false;
      }

      // Verifica se o fundo/secretaria bate
      const fundosPerfil = userInfo.fundo_municipal || [];
      const temFundo = fundosSelecionados.some(f => fundosPerfil.includes(f));
      if (!temFundo) {
        setLoading(false);
        return false;
      }

      setPerfil(userInfo.permissao || null);
      setFundosSelecionados(fundosSelecionados);
      
      // Definir secretaria ativa baseada no primeiro fundo selecionado
      const primeiraSecretaria = fundosSelecionados[0];
      if (primeiraSecretaria) {
        const secretariaNormalizada = normalizarNomeSecretaria(primeiraSecretaria);
        setSecretariaAtiva(secretariaNormalizada);
        localStorage.setItem('secretariaAtiva', secretariaNormalizada);
      }
      
      localStorage.setItem('perfil', userInfo.permissao || '');
      localStorage.setItem('fundosSelecionados', JSON.stringify(fundosSelecionados));

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
    setFundosSelecionados([]);
    setSecretariaAtiva(null);
    localStorage.removeItem('municipio');
    localStorage.removeItem('fundosSelecionados');
    localStorage.removeItem('secretariaAtiva');
    navigate('/login');
  };

  // Carregar município, perfil e fundos do localStorage ao inicializar
  useEffect(() => {
    const savedMunicipio = localStorage.getItem('municipio');
    if (savedMunicipio) {
      try {
        setMunicipio(JSON.parse(savedMunicipio));
      } catch (error) {
        console.error('Erro ao carregar município do localStorage:', error);
      }
    }
    
    const savedPerfil = localStorage.getItem('perfil');
    if (savedPerfil) {
      setPerfil(savedPerfil);
    }
    
    const savedFundos = localStorage.getItem('fundosSelecionados');
    if (savedFundos) {
      try {
        const fundos = JSON.parse(savedFundos);
        if (Array.isArray(fundos)) {
          setFundosSelecionados(fundos);
        } else {
          console.error('Fundos no localStorage não é um array:', fundos);
          setFundosSelecionados([]);
        }
      } catch (error) {
        console.error('Erro ao carregar fundos do localStorage:', error);
        setFundosSelecionados([]);
      }
    }
    
    // Carregar secretaria ativa
    const savedSecretaria = localStorage.getItem('secretariaAtiva');
    if (savedSecretaria) {
      setSecretariaAtiva(savedSecretaria);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      municipio, 
      perfil, 
      fundosSelecionados, 
      secretariaAtiva, 
      setSecretariaAtiva, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Função para normalizar nomes de secretarias para usar no sistema de timbres
function normalizarNomeSecretaria(nomeCompleto: string): string {
  const mapeamento: { [key: string]: string } = {
    'Assistência Social': 'assistencia',
    'Secretaria de Saúde': 'saude',
    'Secretaria de Educação': 'educacao',
    'Prefeitura Municipal': 'prefeitura'
  };
  
  return mapeamento[nomeCompleto] || 'prefeitura';
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
