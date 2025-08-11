
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { RelatorioMensal } from "@/types";

interface RelatoriosCardsProps {
  ultimoRelatorio: RelatorioMensal;
<<<<<<< HEAD
  relatoriosFiltrados: RelatorioMensal[];
}

export const RelatoriosCards = ({ ultimoRelatorio, relatoriosFiltrados }: RelatoriosCardsProps) => {
  const totalContratosPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + (r.totalContratos || 0), 0);
  const totalAtivosPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + (r.contratosAtivos || 0), 0);
  const totalVencidosPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + (r.contratosVencidos || 0), 0);
  const valorTotalContratosPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + (r.valorTotalContratos || 0), 0);
  const valorTotalOrdensPeriodo = relatoriosFiltrados.reduce((acc, r) => acc + (r.valorTotalOrdens || 0), 0);
  
=======
}

export const RelatoriosCards = ({ ultimoRelatorio }: RelatoriosCardsProps) => {
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total de Contratos</CardTitle>
          <CardDescription>No período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          <div className="text-3xl font-bold">{totalContratosPeriodo}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalAtivosPeriodo} ativos | {totalVencidosPeriodo} vencidos
=======
          <div className="text-3xl font-bold">{ultimoRelatorio.totalContratos}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {ultimoRelatorio.contratosAtivos} ativos | {ultimoRelatorio.contratosVencidos} vencidos
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Ordens Realizadas</CardTitle>
          <CardDescription>No período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          <div className="text-3xl font-bold">{ultimoRelatorio?.ordensRealizadas || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {ultimoRelatorio?.ordensConcluidas || 0} concluídas | {ultimoRelatorio?.ordensPendentes || 0} pendentes
=======
          <div className="text-3xl font-bold">{ultimoRelatorio.ordensRealizadas}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {ultimoRelatorio.ordensConcluidas} concluídas | {ultimoRelatorio.ordensPendentes} pendentes
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
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
<<<<<<< HEAD
            {formatCurrency(valorTotalContratosPeriodo)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ordens: {formatCurrency(valorTotalOrdensPeriodo)}
=======
            {formatCurrency(ultimoRelatorio.valorTotalContratos)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ordens: {formatCurrency(ultimoRelatorio.valorTotalOrdens)}
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
