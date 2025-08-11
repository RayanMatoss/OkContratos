
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
<<<<<<< HEAD
import { Menu, LogOut, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
=======
import { Menu, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
import { Menu, LogOut, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import { useToast } from "@/hooks/use-toast";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface AppHeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const AppHeader = ({ onToggleSidebar, isSidebarCollapsed }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  const { municipio, logout } = useAuth();

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
<<<<<<< HEAD
=======

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
      <div className="flex items-center gap-4">
        {municipio && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span>{municipio.nome} - {municipio.uf}</span>
          </div>
        )}
        
<<<<<<< HEAD
=======
      <div className="flex items-center gap-2">
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        <NotificationBell />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="ml-2"
<<<<<<< HEAD
<<<<<<< HEAD
          title="Sair do sistema"
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
          title="Sair do sistema"
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        >
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
