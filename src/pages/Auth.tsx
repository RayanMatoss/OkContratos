import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";
const Auth = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        const {
          error
        } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName
            }
          }
        });
        if (error) throw error;
        toast({
          title: "Conta criada com sucesso",
          description: "Verifique seu email para confirmar o cadastro."
        });
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-background">
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

        <form onSubmit={handleAuth} className="space-y-6">
          {isSignUp && <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input id="fullName" value={formData.fullName} onChange={e => setFormData({
            ...formData,
            fullName: e.target.value
          })} required={isSignUp} />
            </div>}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={formData.password} onChange={e => setFormData({
            ...formData,
            password: e.target.value
          })} required />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignUp ? "Criando conta..." : "Entrando..."}
              </span> : <span>{isSignUp ? "Criar conta" : "Entrar"}</span>}
          </Button>
        </form>

        <div className="text-center">
          
        </div>
      </div>
    </div>;
};
export default Auth;