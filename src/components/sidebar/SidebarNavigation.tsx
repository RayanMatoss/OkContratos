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
<<<<<<< HEAD
<<<<<<< HEAD
import { useAuth } from "@/hooks/useAuth";
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
import { useAuth } from "@/hooks/useAuth";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

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
<<<<<<< HEAD
<<<<<<< HEAD
    label: "Página Inicial"
=======
    label: "Dashboard"
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
    label: "Página Inicial"
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    to: "/dashboard/itens",
    icon: Package,
    label: "Itens"
  },
  {
<<<<<<< HEAD
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
<<<<<<< HEAD
  const { perfil } = useAuth();
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
  const { perfil } = useAuth();
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

  return (
    <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {sidebarLinks.map(link => (
        <SidebarLink 
          key={link.to} 
          {...link} 
<<<<<<< HEAD
<<<<<<< HEAD
          isActive={link.to === "/dashboard" 
=======
          isActive={
            link.to === "/dashboard" 
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
          isActive={link.to === "/dashboard" 
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
              ? currentPath === "/dashboard" 
              : currentPath.startsWith(link.to)
          } 
        />
      ))}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
      {/* Menu exclusivo para admin */}
      {perfil === 'admin' && (
        <SidebarLink
          to="/admin"
          icon={Settings}
          label="Administração"
          isActive={currentPath.startsWith("/admin")}
        />
      )}
<<<<<<< HEAD
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    </div>
  );
};

export default SidebarNavigation;
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======

>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
