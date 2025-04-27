import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Users, FileEdit, Package, ChartBar, Settings, Bell } from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const SidebarLink = ({
  to,
  icon: Icon,
  label,
  isActive
}: SidebarLinkProps) => {
  return <Link to={to} className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors", isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground hover:text-foreground")}>
      <Icon size={20} />
      <span>{label}</span>
    </Link>;
};

const AppSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const sidebarLinks = [{
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard"
  }, {
    to: "/dashboard/contratos",
    icon: FileText,
    label: "Contratos"
  }, {
    to: "/dashboard/fornecedores",
    icon: Users,
    label: "Fornecedores"
  }, {
    to: "/dashboard/ordens",
    icon: FileEdit,
    label: "Ordens"
  }, {
    to: "/dashboard/itens",
    icon: Package,
    label: "Itens"
  }, {
    to: "/dashboard/relatorios",
    icon: ChartBar,
    label: "Relatórios"
  }, {
    to: "/dashboard/configuracoes",
    icon: Settings,
    label: "Configurações"
  }];

  return <aside className="w-64 h-screen bg-sidebar fixed left-0 top-0 border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">
          <span className="text-primary">Ok</span>Contrato
        </h1>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map(link => <SidebarLink key={link.to} to={link.to} icon={link.icon} label={link.label} isActive={link.to === "/dashboard" ? currentPath === "/dashboard" : currentPath.startsWith(link.to)} />)}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <Users size={20} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin Sistema</p>
            <p className="text-xs text-muted-foreground">admin@sistema.gov.br</p>
          </div>
        </div>
      </div>
    </aside>;
};

export default AppSidebar;
