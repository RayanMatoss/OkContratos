
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { RelatorioMensal } from "@/types";

interface RelatoriosCardsProps {
  ultimoRelatorio: RelatorioMensal;
}

export const RelatoriosCards = ({ ultimoRelatorio }: RelatoriosCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total de Contratos</CardTitle>
          <CardDescription>No período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{ultimoRelatorio.totalContratos}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {ultimoRelatorio.contratosAtivos} ativos | {ultimoRelatorio.contratosVencidos} vencidos
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
            {formatCurrency(ultimoRelatorio.valorTotalContratos)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ordens: {formatCurrency(ultimoRelatorio.valorTotalOrdens)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
