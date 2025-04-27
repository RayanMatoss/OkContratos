
import { FileText, Users, Bell, Calendar } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import ChartContainer from "@/components/ChartContainer";
import StatisticsDonut from "@/components/StatisticsDonut";
import BarChartComponent from "@/components/BarChartComponent";
import StatusBadge from "@/components/StatusBadge";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Loader } from "lucide-react";

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral de contratos e ordens de fornecimento
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Contratos"
          value={data.totalContratos}
          icon={FileText}
          description={data.totalContratos === 0 ? "Nenhum contrato registrado" : "Contratos registrados"}
          iconColor="text-primary"
        />
        
        <DashboardCard
          title="Contratos a Vencer"
          value={data.contratosAVencer}
          icon={Calendar}
          description="Próximos 30 dias"
          iconColor="text-warning"
        />
        
        <DashboardCard
          title="Fornecedores"
          value={data.totalFornecedores}
          icon={Users}
          description={data.totalFornecedores === 0 ? "Nenhum fornecedor registrado" : "Fornecedores registrados"}
          iconColor="text-info"
        />
        
        <DashboardCard
          title="Ordens Pendentes"
          value={data.ordensPendentes}
          icon={Bell}
          description={data.ordensPendentes === 0 ? "Nenhuma pendência" : "Necessitam aprovação"}
          iconColor="text-destructive"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartContainer title="Status de Contratos">
          <StatisticsDonut data={data.statusContratosData} />
        </ChartContainer>
        
        <ChartContainer title="Ordens de Fornecimento">
          <BarChartComponent
            data={data.ordensData}
            xAxisKey="name"
            barKey="value"
            barName="Ordens"
            barColor="#3B82F6"
          />
        </ChartContainer>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartContainer title="Contratos Recentes">
          {data.contratosRecentes.length > 0 ? (
            <div className="space-y-4">
              {data.contratosRecentes.map((contrato) => (
                <div 
                  key={contrato.id} 
                  className="flex items-center justify-between border-b border-border pb-3"
                >
                  <div>
                    <p className="font-medium">{contrato.numero}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {contrato.objeto}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contrato.fornecedor?.nome}
                    </p>
                  </div>
                  <StatusBadge status={contrato.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-muted-foreground">Nenhum contrato encontrado</p>
            </div>
          )}
        </ChartContainer>
        
        <ChartContainer title="Ordens Pendentes">
          {data.ordensPendentesLista.length > 0 ? (
            <div className="space-y-4">
              {data.ordensPendentesLista.map((ordem) => (
                <div 
                  key={ordem.id} 
                  className="flex items-center justify-between border-b border-border pb-3"
                >
                  <div>
                    <p className="font-medium">{ordem.numero}</p>
                    <p className="text-sm text-muted-foreground">
                      Contrato: {ordem.contrato?.numero}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ordem.data_emissao).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={ordem.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-muted-foreground">Nenhuma ordem pendente</p>
            </div>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;
