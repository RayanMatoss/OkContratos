import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TesteRecuperacao = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session:", session);
      setSession(session);
    };

    checkSession();
  }, []);

  const handleTeste = async () => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        "viictor99.jv@gmail.com",
        {
          redirectTo: "http://localhost:5173/redefinir-senha",
        }
      );

      if (error) {
        toast({
          title: "Erro no teste",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Teste realizado",
          description: "Email de recuperação enviado. Verifique sua caixa de entrada.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Erro ao testar recuperação de senha.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg border border-border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Teste de Recuperação</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Página para testar a funcionalidade de recuperação de senha
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-semibold">Status da Sessão:</h3>
            <p className="text-sm">
              {session ? "Sessão ativa" : "Sem sessão"}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {JSON.stringify(session, null, 2)}
            </p>
          </div>

          <Button onClick={handleTeste} className="w-full">
            Testar Envio de Email
          </Button>

          <Button 
            onClick={() => navigate("/login")} 
            variant="outline" 
            className="w-full"
          >
            Voltar ao Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TesteRecuperacao; 