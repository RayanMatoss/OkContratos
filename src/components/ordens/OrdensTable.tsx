import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { OrdemFornecimento } from "@/types";
import { Loader } from "lucide-react";
import { TableActions } from "@/components/ui/table-actions";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrdens.length > 0 ? (
            filteredOrdens.map((ordem) => {
              // Can only edit orders that are still pending
              const canEdit = ordem.status === "Pendente";
              // Can only delete orders that are still pending
              const canDelete = ordem.status === "Pendente";
              
              return (
                <TableRow key={ordem.id}>
                  <TableCell className="font-medium">{ordem.numero}</TableCell>
                  <TableCell>{ordem.contrato?.numero}</TableCell>
                  <TableCell>
                    {format(new Date(ordem.dataEmissao), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{ordem.contrato?.fornecedor?.nome}</TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <TableActions
                        onEdit={() => onEdit(ordem)}
                        onDelete={() => onDelete(ordem)}
                        showEdit={true}
                        showDelete={true}
                        disableDelete={!canDelete}
                        disableEdit={!canEdit}
                        deleteTooltip={
                          !canDelete 
                            ? "Não é possível excluir uma ordem que já foi concluída" 
                            : undefined
                        }
                        editTooltip={
                          !canEdit 
                            ? "Não é possível editar uma ordem que já foi concluída" 
                            : undefined
                        }
                      />
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
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
