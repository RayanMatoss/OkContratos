import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableActions } from "@/components/ui/table-actions";
import { Contrato, FundoMunicipal } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContratosTableProps {
  contratos: Contrato[];
  onEdit?: (contrato: Contrato) => void;
  onDelete?: (contrato: Contrato) => void;
  onView?: (contrato: Contrato) => void;
}

const ContratosTable = ({ contratos, onEdit, onDelete, onView }: ContratosTableProps) => {
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
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView?.(contrato)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <TableActions
                        onEdit={() => onEdit?.(contrato)}
                        onDelete={() => onDelete?.(contrato)}
                        showEdit={contrato.status !== "Expirado"}
                        showDelete={contrato.status !== "Expirado"}
                        disableEdit={contrato.status === "Expirado"}
                        disableDelete={contrato.status === "Expirado"}
                        editTooltip={contrato.status === "Expirado" ? "Contratos expirados não podem ser editados" : undefined}
                        deleteTooltip={contrato.status === "Expirado" ? "Contratos expirados não podem ser excluídos" : undefined}
                      />
                    </div>
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
        </TableBody>
      </Table>
    </div>
  );
};

export default ContratosTable;
