
<<<<<<< HEAD
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Contrato } from "@/types";
import { Edit, Trash2, Eye } from "lucide-react";
=======
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableActions } from "@/components/ui/table-actions";
import { Contrato, FundoMunicipal } from "@/types";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
import { Badge } from "@/components/ui/badge";

interface ContratosTableProps {
  contratos: Contrato[];
<<<<<<< HEAD
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
=======
  onEdit?: (contrato: Contrato) => void;
  onDelete?: (contrato: Contrato) => void;
}

const ContratosTable = ({ contratos, onEdit, onDelete }: ContratosTableProps) => {
  return (
    <div className="rounded-md border">
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
<<<<<<< HEAD
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
=======
            <TableHead>Fornecedor</TableHead>
            <TableHead>Fundo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vigência</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratos.length > 0 ? (
            contratos.map((contrato) => {
              const fundos = Array.isArray(contrato.fundoMunicipal) ? contrato.fundoMunicipal : [];
              
              return (
                <TableRow key={contrato.id}>
                  <TableCell className="font-medium">{contrato.numero}</TableCell>
                  <TableCell>{contrato.fornecedor?.nome}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {fundos.length > 0 ? (
                        fundos.map((fundo, index) => (
                          <Badge key={index} variant="secondary">
                            {fundo}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Não especificado</span>
                      )}
                    </div>
                  </TableCell>
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
                  <TableCell className="text-right">
                    <TableActions
                      onEdit={() => onEdit?.(contrato)}
                      onDelete={() => onDelete?.(contrato)}
                      showEdit={contrato.status === "Em Aprovação"}
                      showDelete={contrato.status === "Em Aprovação"}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum contrato encontrado.
              </TableCell>
            </TableRow>
          )}
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
        </TableBody>
      </Table>
    </div>
  );
};

export default ContratosTable;
