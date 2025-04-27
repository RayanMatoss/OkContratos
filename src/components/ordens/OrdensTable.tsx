
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { format } from "date-fns";
import { OrdemFornecimento } from "@/types";
import { Loader } from "lucide-react";
import { TableActions } from "@/components/ui/table-actions";

interface OrdensTableProps {
  filteredOrdens: OrdemFornecimento[];
  loading: boolean;
  onEdit: (ordem: OrdemFornecimento) => void;
  onDelete: (ordem: OrdemFornecimento) => void;
}

const OrdensTable = ({ 
  filteredOrdens, 
  loading,
  onEdit,
  onDelete 
}: OrdensTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Contrato</TableHead>
            <TableHead>Emissão</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrdens.length > 0 ? (
            filteredOrdens.map((ordem) => (
              <TableRow key={ordem.id}>
                <TableCell className="font-medium">{ordem.numero}</TableCell>
                <TableCell>{ordem.contrato?.numero}</TableCell>
                <TableCell>
                  {format(new Date(ordem.dataEmissao), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{ordem.contrato?.fornecedor?.nome}</TableCell>
                <TableCell>
                  <StatusBadge status={ordem.status} />
                </TableCell>
                <TableCell className="text-right">
                  <TableActions
                    onEdit={() => onEdit(ordem)}
                    onDelete={() => onDelete(ordem)}
                    showEdit={ordem.status === "Pendente"}
                    showDelete={ordem.status === "Pendente"}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhuma ordem encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdensTable;
