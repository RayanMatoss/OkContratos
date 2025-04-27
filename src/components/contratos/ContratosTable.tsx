
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { Contrato } from "@/types";

interface ContratosTableProps {
  contratos: Contrato[];
}

const ContratosTable = ({ contratos }: ContratosTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Fundo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vigência</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratos.length > 0 ? (
            contratos.map((contrato) => (
              <TableRow key={contrato.id}>
                <TableCell className="font-medium">{contrato.numero}</TableCell>
                <TableCell>{contrato.fornecedor?.nome}</TableCell>
                <TableCell>{contrato.fundoMunicipal}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(contrato.valor)}
                </TableCell>
                <TableCell>
                  {format(new Date(contrato.dataInicio), 'dd/MM/yyyy')} a{' '}
                  {format(new Date(contrato.dataTermino), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <StatusBadge status={contrato.status} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum contrato encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContratosTable;
