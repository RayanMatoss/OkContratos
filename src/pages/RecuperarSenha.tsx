import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePasswordRecovery } from "@/hooks/usePasswordRecovery";
import { FileText, ArrowLeft, Mail, CheckCircle } from "lucide-react";

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, sendRecoveryEmail, resetState } = usePasswordRecovery();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleRecuperarSenha = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, digite seu email.",
        variant: "destructive",
      });
      return;
    }

    const success = await sendRecoveryEmail(email);

    if (success) {
      setEmailSent(true);
      toast({
        title: "Email enviado com sucesso",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } else if (state.error) {
      toast({
        title: "Erro ao enviar email",
        description: state.error,
        variant: "destructive",
      });
    }
  };

  const handleVoltar = () => {
    navigate("/login");
  };

  if (emailSent) {
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
              Email Enviado!
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enviamos um link de recuperação para <strong>{email}</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Verifique sua caixa de entrada e clique no link para redefinir sua senha.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleVoltar}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Login
            </Button>
            
            <Button
              onClick={() => {
                setEmailSent(false);
                setEmail("");
                resetState();
              }}
              className="w-full"
            >
              Enviar Novamente
            </Button>
          </div>
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
            Recuperação de Senha
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Mail size={24} />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Esqueceu sua senha?
          </h2>
          <p className="text-sm text-muted-foreground">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleRecuperarSenha} className="space-y-6">
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

          <Button
            type="submit"
            className="w-full"
            disabled={state.isLoading}
          >
            {state.isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
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

export default RecuperarSenha; 