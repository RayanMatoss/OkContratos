
import { TableRow, TableCell } from "@/components/ui/table";

interface TableEmptyProps {
  loading: boolean;
  colSpan: number;
  loadingText?: string;
  emptyText?: string;
}

export const TableEmpty = ({ 
  loading, 
  colSpan, 
  loadingText = "Carregando itens...", 
  emptyText = "Nenhum item encontrado." 
}: TableEmptyProps) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {loading ? loadingText : emptyText}
      </TableCell>
    </TableRow>
  );
};
