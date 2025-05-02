
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
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {format(new Date(relatorio.ano, relatorio.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{relatorio.totalContratos}</TableCell>
                <TableCell>{relatorio.contratosAtivos}</TableCell>
                <TableCell>{relatorio.contratosVencidos}</TableCell>
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
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {format(new Date(relatorio.ano, relatorio.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{relatorio.ordensRealizadas}</TableCell>
                <TableCell>{relatorio.ordensConcluidas}</TableCell>
                <TableCell>{relatorio.ordensPendentes}</TableCell>
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
            <TableRow key={index}>
              <TableCell className="font-medium">
                {format(new Date(relatorio.ano, relatorio.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell>{formatCurrency(relatorio.valorTotalContratos)}</TableCell>
              <TableCell>{formatCurrency(relatorio.valorTotalOrdens)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
