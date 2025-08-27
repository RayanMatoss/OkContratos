
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { RelatorioMensal } from "@/types";

interface RelatoriosTablesProps {
  relatoriosFiltrados: RelatorioMensal[];
  activeTab: string;
}

export const RelatoriosTables = ({ relatoriosFiltrados, activeTab }: RelatoriosTablesProps) => {
  if (activeTab === "contratos") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Total Contratos</TableHead>
              <TableHead>Ativos</TableHead>
              <TableHead>Vencidos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relatoriosFiltrados.map((relatorio, index) => (
              <TableRow key={`contratos-${relatorio.ano}-${relatorio.mes}`}>
                <TableCell className="font-medium">
                  {format(new Date(relatorio.ano, relatorio.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{relatorio.totalContratos || 0}</TableCell>
                <TableCell>{relatorio.contratosAtivos || 0}</TableCell>
                <TableCell>{relatorio.contratosVencidos || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (activeTab === "ordens") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Total Ordens</TableHead>
              <TableHead>Concluídas</TableHead>
              <TableHead>Pendentes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relatoriosFiltrados.map((relatorio, index) => (
              <TableRow key={`ordens-${relatorio.ano}-${relatorio.mes}`}>
                <TableCell className="font-medium">
                  {format(new Date(relatorio.ano, relatorio.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{relatorio.ordensRealizadas || 0}</TableCell>
                <TableCell>{relatorio.ordensConcluidas || 0}</TableCell>
                <TableCell>{relatorio.ordensPendentes || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Período</TableHead>
            <TableHead>Valor Total Contratos</TableHead>
            <TableHead>Valor Total Ordens</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relatoriosFiltrados.map((relatorio, index) => (
            <TableRow key={`geral-${relatorio.ano}-${relatorio.mes}`}>
              <TableCell className="font-medium">
                {format(new Date(relatorio.ano, relatorio.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell>{formatCurrency(relatorio.valorTotalContratos || 0)}</TableCell>
              <TableCell>{formatCurrency(relatorio.valorTotalOrdens || 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
