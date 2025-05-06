import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Package, 
  FileEdit, 
  ChartBar, 
  Settings 
} from "lucide-react";

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
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

const sidebarLinks = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Página Inicial"
  },
  {
    to: "/dashboard/fornecedores",
    icon: Users,
    label: "Fornecedores"
  },
  {
    to: "/dashboard/contratos",
    icon: FileText,
    label: "Contratos"
  },
  {
    to: "/dashboard/itens",
    icon: Package,
    label: "Itens"
  },
  {
    to: "/dashboard/ordens",
    icon: FileEdit,
    label: "Ordens"
  },
  {
    to: "/dashboard/relatorios",
    icon: ChartBar,
    label: "Relatórios"
  },
  {
    to: "/dashboard/configuracoes",
    icon: Settings,
    label: "Configurações"
  }
];

const SidebarNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {sidebarLinks.map(link => (
        <SidebarLink 
          key={link.to} 
          {...link} 
          isActive={link.to === "/dashboard" 
              ? currentPath === "/dashboard" 
              : currentPath.startsWith(link.to)
          } 
        />
      ))}
    </div>
  );
};

export default SidebarNavigation;

