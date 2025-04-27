
import { FileText, Users, Bell, Calendar } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import ChartContainer from "@/components/ChartContainer";
import StatisticsDonut from "@/components/StatisticsDonut";
import BarChartComponent from "@/components/BarChartComponent";
import { contratos, getDashboardData, relatorios, ordens } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";

const Dashboard = () => {
  const { totalContratos, contratosAVencer, totalFornecedores, ordensPendentes } = getDashboardData();

  const statusContratosData = [
    { 
      name: "Ativos", 
      value: contratos.filter(c => c.status === "Ativo").length, 
      color: "#10B981" 
    },
    { 
      name: "A Vencer", 
      value: contratos.filter(c => c.status === "A Vencer").length, 
      color: "#F59E0B"
    },
    { 
      name: "Expirados", 
      value: contratos.filter(c => c.status === "Expirado").length, 
      color: "#EF4444"
    },
  ];

  const ordensData = relatorios.map(r => ({
    name: `${r.mes}/${r.ano}`,
    value: r.ordensRealizadas,
  }));

  const contratosRecentes = [...contratos]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const ordensPendentesLista = ordens
    .filter(o => o.status === "Pendente")
    .slice(0, 5);

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

      <div className="grid gap-6 md:grid-cols-2">
        <ChartContainer title="Status de Contratos">
          <StatisticsDonut data={statusContratosData} />
        </ChartContainer>
        
        <ChartContainer title="Ordens de Fornecimento">
          <BarChartComponent
            data={ordensData}
            xAxisKey="name"
            barKey="value"
            barName="Ordens"
            barColor="#3B82F6"
          />
        </ChartContainer>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartContainer title="Contratos Recentes">
          {contratosRecentes.length > 0 ? (
            <div className="space-y-4">
              {contratosRecentes.map((contrato) => (
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
          {ordensPendentesLista.length > 0 ? (
            <div className="space-y-4">
              {ordensPendentesLista.map((ordem) => (
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
                      {new Date(ordem.dataEmissao).toLocaleDateString()}
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
