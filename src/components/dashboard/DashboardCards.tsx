import { FileText, Users, Bell, Calendar, AlertTriangle } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";

interface DashboardCardsProps {
  totalContratos: number;
  contratosAVencer: number;
  totalFornecedores: number;
  itensAlerta: number;
  onAlertClick: () => void;
  onContratosClick: () => void;
  onContratosVencerClick: () => void;
  onFornecedoresClick: () => void;
}

const DashboardCards = ({
  totalContratos,
  contratosAVencer,
  totalFornecedores,
  itensAlerta,
  onAlertClick,
  onContratosClick,
  onContratosVencerClick,
  onFornecedoresClick
}: DashboardCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total de Contratos"
        value={totalContratos}
        icon={FileText}
        description={totalContratos === 0 ? "Nenhum contrato registrado" : "Contratos registrados"}
        iconColor="text-primary"
        className="cursor-pointer hover:shadow-lg"
        onClick={onContratosClick}
      />
      
      <DashboardCard
        title="Contratos a Vencer"
        value={contratosAVencer}
        icon={Calendar}
        description="Próximos 30 dias"
        iconColor="text-warning"
        className="cursor-pointer hover:shadow-lg"
        onClick={onContratosVencerClick}
      />
      
      <DashboardCard
        title="Fornecedores"
        value={totalFornecedores}
        icon={Users}
        description={totalFornecedores === 0 ? "Nenhum fornecedor registrado" : "Fornecedores registrados"}
        iconColor="text-info"
        className="cursor-pointer hover:shadow-lg"
        onClick={onFornecedoresClick}
      />
      
      <DashboardCard
        title="Itens em Alerta"
        value={itensAlerta}
        icon={AlertTriangle}
        description={itensAlerta === 0 ? "Nenhum item em alerta" : "Itens com consumo acima de 90%"}
        iconColor="text-destructive"
        className="cursor-pointer hover:shadow-lg"
        onClick={onAlertClick}
      />
    </div>
  );
};

export default DashboardCards;
