
import { FileText, Users, Bell, Calendar } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";

interface DashboardCardsProps {
  totalContratos: number;
  contratosAVencer: number;
  totalFornecedores: number;
  ordensPendentes: number;
}

const DashboardCards = ({
  totalContratos,
  contratosAVencer,
  totalFornecedores,
  ordensPendentes,
}: DashboardCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total de Contratos"
        value={totalContratos}
        icon={FileText}
        description={totalContratos === 0 ? "Nenhum contrato registrado" : "Contratos registrados"}
        iconColor="text-primary"
      />
      
      <DashboardCard
        title="Contratos a Vencer"
        value={contratosAVencer}
        icon={Calendar}
        description="Próximos 30 dias"
        iconColor="text-warning"
      />
      
      <DashboardCard
        title="Fornecedores"
        value={totalFornecedores}
        icon={Users}
        description={totalFornecedores === 0 ? "Nenhum fornecedor registrado" : "Fornecedores registrados"}
        iconColor="text-info"
      />
      
      <DashboardCard
        title="Ordens Pendentes"
        value={ordensPendentes}
        icon={Bell}
        description={ordensPendentes === 0 ? "Nenhuma pendência" : "Necessitam aprovação"}
        iconColor="text-destructive"
      />
    </div>
  );
};

export default DashboardCards;
