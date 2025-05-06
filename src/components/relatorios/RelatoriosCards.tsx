import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { RelatorioMensal } from "@/types";

interface RelatoriosCardsProps {
  ultimoRelatorio: RelatorioMensal;
  relatoriosFiltrados: RelatorioMensal[];
}

export const RelatoriosCards = ({ ultimoRelatorio, relatoriosFiltrados }: RelatoriosCardsProps) => {
  const totalContratosPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + r.totalContratos, 0);
  const totalAtivosPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + r.contratosAtivos, 0);
  const totalVencidosPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + r.contratosVencidos, 0);
  const valorTotalContratosPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + r.valorTotalContratos, 0);
  const valorTotalOrdensPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + r.valorTotalOrdens, 0);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total de Contratos</CardTitle>
          <CardDescription>No período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalContratosPeriodo}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalAtivosPeriodo} ativos | {totalVencidosPeriodo} vencidos
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Ordens Realizadas</CardTitle>
          <CardDescription>No período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{ultimoRelatorio.ordensRealizadas}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {ultimoRelatorio.ordensConcluidas} concluídas | {ultimoRelatorio.ordensPendentes} pendentes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Valor Total</CardTitle>
          <CardDescription>Contratos no período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatCurrency(valorTotalContratosPeriodo)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ordens: {formatCurrency(valorTotalOrdensPeriodo)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
