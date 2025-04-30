
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableActions } from "@/components/ui/table-actions";
import { Contrato, FundoMunicipal } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ContratosTableProps {
  contratos: Contrato[];
  onEdit?: (contrato: Contrato) => void;
  onDelete?: (contrato: Contrato) => void;
}

const ContratosTable = ({ contratos, onEdit, onDelete }: ContratosTableProps) => {
  // Helper function to convert string or array to array
  const getFundosArray = (fundos: string | FundoMunicipal | FundoMunicipal[]): FundoMunicipal[] => {
    if (Array.isArray(fundos)) {
      return fundos;
    } else if (typeof fundos === 'string') {
      return fundos.split(', ').filter(Boolean) as FundoMunicipal[];
    } else if (fundos) {
      return [fundos as FundoMunicipal];
    }
    return [];
  };

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
              const fundos = getFundosArray(contrato.fundoMunicipal);
              
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
        </TableBody>
      </Table>
    </div>
  );
};

export default ContratosTable;
