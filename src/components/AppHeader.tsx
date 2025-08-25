
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, MapPin, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { TimbreSelector } from "@/components/ui/timbre-selector";

interface AppHeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const AppHeader = ({ onToggleSidebar, isSidebarCollapsed }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { municipio, logout, secretariaAtiva, setSecretariaAtiva, fundosSelecionados } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado do sistema.",
      });
    } catch (error: unknown) {
      let message = 'Erro desconhecido';
      if (error instanceof Error) message = error.message;
      toast({
        title: "Erro ao sair",
        description: message,
        variant: "destructive"
      });
    }
  };

  return (
    <header className={`h-16 fixed top-0 right-0 bg-background border-b border-border z-10 flex items-center justify-between px-4 ${
      isSidebarCollapsed ? "left-16" : "left-64"
    }`}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {municipio && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span>{municipio.nome} - {municipio.uf}</span>
          </div>
        )}
        
        {/* Seletor de Secretaria Ativa */}
        {fundosSelecionados.length > 1 && (
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-muted-foreground" />
            <TimbreSelector
              value={secretariaAtiva || 'prefeitura'}
              onValueChange={setSecretariaAtiva}
              className="w-40"
            />
          </div>
        )}
        
        <NotificationBell />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="ml-2"
          title="Sair do sistema"
        >
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
