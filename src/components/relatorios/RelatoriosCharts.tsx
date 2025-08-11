
import ChartContainer from "@/components/ChartContainer";
import StatisticsDonut from "@/components/StatisticsDonut";
import BarChartComponent from "@/components/BarChartComponent";

interface RelatoriosChartsProps {
  activeTab: string;
  contratosData: any[];
  ordensData: any[];
  financeiroData: any[];
  statusContratosData: any[];
  statusOrdensData: any[];
}

export const RelatoriosCharts = ({
  activeTab,
  contratosData,
  ordensData,
  financeiroData,
  statusContratosData,
  statusOrdensData
}: RelatoriosChartsProps) => {
  if (activeTab === "contratos") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <ChartContainer title="Evolução de Contratos">
          <BarChartComponent
            data={contratosData}
            xAxisKey="name"
            barKey="value"
            barName="Contratos"
            barColor="#3B82F6"
          />
        </ChartContainer>
        
        <ChartContainer title="Status dos Contratos">
          <StatisticsDonut data={statusContratosData} />
        </ChartContainer>
      </div>
    );
  }

  if (activeTab === "ordens") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <ChartContainer title="Ordens de Fornecimento">
          <BarChartComponent
            data={ordensData}
            xAxisKey="name"
            barKey="total"
            barName="Ordens"
            barColor="#F59E0B"
          />
        </ChartContainer>
        
        <ChartContainer title="Status das Ordens">
          <StatisticsDonut data={statusOrdensData} />
        </ChartContainer>
      </div>
    );
  }

  return (
    <ChartContainer title="Valores (em milhares de R$)">
      <BarChartComponent
        data={financeiroData}
        xAxisKey="name"
        barKey="contratos"
        barName="Contratos"
        barColor="#3B82F6"
      />
    </ChartContainer>
  );
};
