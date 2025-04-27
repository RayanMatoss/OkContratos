
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { notificacoes } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const AppHeader = ({ onToggleSidebar, isSidebarCollapsed }: AppHeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const unreadNotifications = notificacoes.filter(n => !n.lida).length;

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
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificacoes.length > 0 ? (
              notificacoes.map((notif) => (
                <DropdownMenuItem key={notif.id} className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{notif.titulo}</span>
                    <span className="text-xs text-muted-foreground">{notif.mensagem}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notif.data).toLocaleDateString()}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Sem notificações
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
