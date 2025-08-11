<<<<<<< HEAD
import { FileText, Users, Bell, Calendar, AlertTriangle } from "lucide-react";
=======

import { FileText, Users, Bell, Calendar } from "lucide-react";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
import DashboardCard from "@/components/DashboardCard";

interface DashboardCardsProps {
  totalContratos: number;
  contratosAVencer: number;
  totalFornecedores: number;
<<<<<<< HEAD
  itensAlerta: number;
  onAlertClick: () => void;
  onContratosClick: () => void;
  onContratosVencerClick: () => void;
  onFornecedoresClick: () => void;
=======
  ordensPendentes: number;
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
}

const DashboardCards = ({
  totalContratos,
  contratosAVencer,
  totalFornecedores,
<<<<<<< HEAD
  itensAlerta,
  onAlertClick,
  onContratosClick,
  onContratosVencerClick,
  onFornecedoresClick
=======
  ordensPendentes,
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
}: DashboardCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total de Contratos"
        value={totalContratos}
        icon={FileText}
        description={totalContratos === 0 ? "Nenhum contrato registrado" : "Contratos registrados"}
        iconColor="text-primary"
<<<<<<< HEAD
        className="cursor-pointer hover:shadow-lg"
        onClick={onContratosClick}
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
      />
      
      <DashboardCard
        title="Contratos a Vencer"
        value={contratosAVencer}
        icon={Calendar}
        description="Próximos 30 dias"
        iconColor="text-warning"
<<<<<<< HEAD
        className="cursor-pointer hover:shadow-lg"
        onClick={onContratosVencerClick}
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
      />
      
      <DashboardCard
        title="Fornecedores"
        value={totalFornecedores}
        icon={Users}
        description={totalFornecedores === 0 ? "Nenhum fornecedor registrado" : "Fornecedores registrados"}
        iconColor="text-info"
<<<<<<< HEAD
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
=======
      />
      
      <DashboardCard
        title="Ordens Pendentes"
        value={ordensPendentes}
        icon={Bell}
        description={ordensPendentes === 0 ? "Nenhuma pendência" : "Necessitam aprovação"}
        iconColor="text-destructive"
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
      />
    </div>
  );
};

export default DashboardCards;
