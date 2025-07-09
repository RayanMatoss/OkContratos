
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { municipios } from "@/data/mockData";
import { FileText, Lock } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [municipioId, setMunicipioId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const success = await login(email, password, municipioId);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema!",
        });
        navigate("/");
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Email, senha ou município inválidos.",
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
            <span className="text-primary">Lumen</span>Contract
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sistema de Controle de Contratos
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Senha</Label>
              <a 
                href="#" 
                className="text-xs text-primary hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
