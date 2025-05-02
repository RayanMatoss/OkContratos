
import { Table, TableBody } from "@/components/ui/table";
import { ItemResponse } from "@/hooks/itens/useItensCrud";
import { TableHeader } from "./TableHeader";
import { TableEmpty } from "./TableEmpty";
import { ItemRow } from "./ItemRow";

interface ItemsTableProps {
  items: ItemResponse[];
  loading: boolean;
  onEdit?: (item: ItemResponse) => void;
  onDelete?: (item: ItemResponse) => void;
}

export const ItemsTable = ({ items, loading, onEdit, onDelete }: ItemsTableProps) => {
  const columns = [
    "Descrição", 
    "Contrato", 
    "Fornecedor", 
    "Quantidade", 
    "Consumido", 
    "Unidade", 
    "Valor Unit.", 
    "Valor Total", 
    "Ações"
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader columns={columns} />
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <ItemRow 
                key={item.id} 
                item={item} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))
          ) : (
            <TableEmpty 
              loading={loading} 
              colSpan={columns.length} 
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};
