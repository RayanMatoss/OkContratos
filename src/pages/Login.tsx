import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Lock } from "lucide-react";
import FundoMunicipalSelector from '@/components/contratos/FundoMunicipalSelector';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [municipioId, setMunicipioId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [municipios, setMunicipios] = useState([]);
  const [selectedFundos, setSelectedFundos] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchMunicipios = async () => {
      const { data, error } = await supabase
        .from("municipios")
        .select("id, nome, uf");
      if (error) {
        setMunicipios([]);
      } else {
        setMunicipios(data || []);
      }
    };
    fetchMunicipios();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!municipioId) {
      toast({
        title: "Seleção obrigatória",
        description: "Por favor, selecione um município.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFundos.length === 0) {
      toast({
        title: "Seleção obrigatória",
        description: "Por favor, selecione pelo menos um fundo/secretaria.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username, password, municipioId, selectedFundos);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema!",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Nome de usuário, senha, município ou fundo/secretaria inválidos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg border border-border">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <FileText size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-primary">Ok</span>Contratos
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sistema de Controle de Contratos
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Senha</Label>
              <button 
                type="button"
                onClick={() => navigate("/recuperar-senha")}
                className="text-xs text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.221 1.125-4.575m2.122-2.122A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.221-1.125 4.575m-2.122 2.122A9.956 9.956 0 0112 21c5.523 0 10-4.477 10-10 0-1.657.403-3.221 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.221 1.125-4.575m2.122-2.122A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.221-1.125 4.575m-2.122 2.122A9.956 9.956 0 0112 21c5.523 0 10-4.477 10-10 0-1.657.403-3.221 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="municipio">Município</Label>
            <Select value={municipioId} onValueChange={setMunicipioId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu município" />
              </SelectTrigger>
              <SelectContent>
                {municipios.map((municipio) => (
                  <SelectItem key={municipio.id} value={municipio.id}>
                    {municipio.nome} - {municipio.uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Adicionando seleção de fundos/secretarias */}
          <FundoMunicipalSelector selectedFundos={selectedFundos} onChange={setSelectedFundos} />

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm">
              Lembrar minha conta
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock size={16} />
                Entrar
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
