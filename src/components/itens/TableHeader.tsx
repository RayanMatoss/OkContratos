
import { TableHead, TableHeader as UITableHeader, TableRow } from "@/components/ui/table";

interface TableHeaderProps {
  columns: string[];
}

export const TableHeader = ({ columns }: TableHeaderProps) => {
  return (
    <UITableHeader>
      <TableRow>
        {columns.map((column, index) => (
          <TableHead 
            key={index}
            className={column === "Valor Unit." || 
                      column === "Valor Total" || 
                      column === "Quantidade" ||
                      column === "Consumido" ||
                      column === "Ações" ? "text-right" : ""}
          >
            {column}
          </TableHead>
        ))}
      </TableRow>
    </UITableHeader>
  );
};
