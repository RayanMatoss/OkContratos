
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Contrato } from "@/types";
import { Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContratosTableProps {
  contratos: Contrato[];
  onEdit: (contrato: Contrato) => void;
  onDelete: (contrato: Contrato) => void;
  onView: (contrato: Contrato) => void;
}

const ContratosTable: React.FC<ContratosTableProps> = ({
  contratos,
  onEdit,
  onDelete,
  onView
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Fornecedores</TableHead>
            <TableHead>Objeto</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data Início</TableHead>
            <TableHead>Data Término</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratos.map((contrato) => (
            <TableRow key={contrato.id}>
              <TableCell>
                {contrato.numeroCompleto || contrato.numero}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contrato.fornecedores && contrato.fornecedores.length > 0 ? (
                    contrato.fornecedores.map((fornecedor) => (
                      <Badge key={fornecedor.id} variant="secondary" className="text-xs">
                        {fornecedor.nome}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">Nenhum fornecedor</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{contrato.objeto}</TableCell>
              <TableCell>
                {contrato.valor?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </TableCell>
              <TableCell>
                {format(contrato.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                {format(contrato.dataTermino, "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <StatusBadge status={contrato.status} />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(contrato)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(contrato)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(contrato)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContratosTable;
