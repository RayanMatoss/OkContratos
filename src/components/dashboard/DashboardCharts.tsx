
import ChartContainer from "@/components/ChartContainer";
import StatisticsDonut from "@/components/StatisticsDonut";
import BarChartComponent from "@/components/BarChartComponent";

interface DashboardChartsProps {
  statusContratosData: { name: string; value: number; color: string }[];
  ordensData: { name: string; value: number }[];
}

const DashboardCharts = ({
  statusContratosData,
  ordensData,
}: DashboardChartsProps) => {
  return (
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
  );
};

export default DashboardCharts;
