import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { TableActions } from "@/components/ui/table-actions";
import { formatCurrency } from "@/lib/utils";
import { Contrato } from "@/types";

interface ContratosTableProps {
  contratos: Contrato[];
  onEdit: (contrato: Contrato) => void;
  onDelete: (contrato: Contrato) => void;
}

export const ContratosTable = ({ contratos, onEdit, onDelete }: ContratosTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Objeto</TableHead>
            <TableHead>Fundo Municipal</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Data Início</TableHead>
            <TableHead>Data Término</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratos.length > 0 ? (
            contratos.map((contrato) => (
              <TableRow key={contrato.id}>
                <TableCell className="font-medium">{contrato.numero}</TableCell>
                <TableCell>{contrato.fornecedor?.nome}</TableCell>
                <TableCell className="max-w-xs truncate">{contrato.objeto}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {contrato.fundoMunicipal.map((fundo: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {fundo}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(contrato.valor)}
                </TableCell>
                <TableCell>{format(contrato.dataInicio, "dd/MM/yyyy")}</TableCell>
                <TableCell>{format(contrato.dataTermino, "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <StatusBadge status={contrato.status} />
                </TableCell>
                <TableCell className="text-right">
                  <TableActions
                    onEdit={() => onEdit(contrato)}
                    onDelete={() => onDelete(contrato)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Nenhum contrato encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
