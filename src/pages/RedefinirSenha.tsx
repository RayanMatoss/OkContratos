import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePasswordRecovery } from "@/hooks/usePasswordRecovery";
import { supabase } from "@/integrations/supabase/client";
import { FileText, ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const RedefinirSenha = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, resetPassword, resetState } = usePasswordRecovery();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Verificar se há uma sessão de recuperação de senha
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Link inválido",
          description: "Este link de recuperação não é válido ou expirou.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      setSession(session);
    };

    checkSession();
  }, [navigate, toast]);

  const handleRedefinirSenha = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const success = await resetPassword(password);

    if (success) {
      setPasswordChanged(true);
      toast({
        title: "Senha redefinida com sucesso",
        description: "Sua senha foi alterada. Você será redirecionado para o login.",
      });
      
      // Fazer logout para limpar a sessão de recuperação
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else if (state.error) {
      toast({
        title: "Erro ao redefinir senha",
        description: state.error,
        variant: "destructive",
      });
    }
  };

  const handleVoltar = () => {
    navigate("/login");
  };

  if (passwordChanged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg border border-border">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-600">
              Senha Redefinida!
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sua senha foi alterada com sucesso.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Você será redirecionado para a página de login em alguns segundos...
            </p>
          </div>

          <Button
            onClick={handleVoltar}
            className="w-full"
          >
            Ir para o Login
          </Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg border border-border">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <Lock size={24} />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-red-600">
              Link Inválido
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Este link de recuperação não é válido ou expirou.
            </p>
          </div>

          <Button
            onClick={handleVoltar}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Login
          </Button>
        </div>
      </div>
    );
  }

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
            Redefinir Senha
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Lock size={24} />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Defina sua nova senha
          </h2>
          <p className="text-sm text-muted-foreground">
            Digite sua nova senha abaixo.
          </p>
        </div>

        <form onSubmit={handleRedefinirSenha} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={state.isLoading}
          >
            {state.isLoading ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </form>

        <div className="text-center">
          <Button
            onClick={handleVoltar}
            variant="ghost"
            className="text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RedefinirSenha; 