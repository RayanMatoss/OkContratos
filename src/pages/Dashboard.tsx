
import { Loader } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardCards from "@/components/dashboard/DashboardCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentContracts from "@/components/dashboard/RecentContracts";
import PendingOrders from "@/components/dashboard/PendingOrders";

const Dashboard = () => {
  const { data, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader />
      
      <DashboardCards
        totalContratos={data.totalContratos}
        contratosAVencer={data.contratosAVencer}
        totalFornecedores={data.totalFornecedores}
        ordensPendentes={data.ordensPendentes}
      />

      <DashboardCharts
        statusContratosData={data.statusContratosData}
        ordensData={data.ordensData}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentContracts contratos={data.contratosRecentes} />
        <PendingOrders orders={data.ordensPendentesLista} />
      </div>
    </div>
  );
};

export default Dashboard;
