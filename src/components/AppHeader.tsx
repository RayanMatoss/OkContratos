
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AppHeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const AppHeader = ({ onToggleSidebar, isSidebarCollapsed }: AppHeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
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
    <header className={cn(
      "h-16 fixed top-0 right-0 bg-background border-b border-border z-10 flex items-center justify-between px-4",
      isSidebarCollapsed ? "left-16" : "left-64"
    )}>
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
        {showSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search size={20} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-muted-foreground">
              Sem notificações
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

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
