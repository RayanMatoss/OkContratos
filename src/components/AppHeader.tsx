
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface AppHeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const AppHeader = ({ onToggleSidebar, isSidebarCollapsed }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
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

      <div className="flex items-center gap-2">
        <NotificationBell />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="ml-2"
        >
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
