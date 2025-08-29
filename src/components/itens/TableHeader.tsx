
import { TableHead, TableHeader as UITableHeader, TableRow } from "@/components/ui/table";

interface TableHeaderProps {
  columns: string[];
}

export const TableHeader = ({ columns }: TableHeaderProps) => {
  const getColumnClasses = (column: string) => {
    switch (column) {
      case "Quantidade":
      case "Valor Unit.":
      case "Valor Total":
        return "text-right";
      case "Unidade":
      case "Ações":
        return "text-center";
      default:
        return "";
    }
  };

  return (
    <UITableHeader>
      <TableRow>
        {columns.map((column, index) => (
          <TableHead 
            key={`header-${index}-${column}`}
            className={getColumnClasses(column)}
          >
            {column}
          </TableHead>
        ))}
      </TableRow>
    </UITableHeader>
  );
};
