
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { TableActions } from "@/components/ui/table-actions";
import { ItemResponse } from "@/hooks/itens/useItensCrud";

interface ItemRowProps {
  item: ItemResponse;
  onEdit?: (item: ItemResponse) => void;
  onDelete?: (item: ItemResponse) => void;
}

export const ItemRow = ({ item, onEdit, onDelete }: ItemRowProps) => {
  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.descricao}</TableCell>
      <TableCell>{item.contratos?.numero}</TableCell>
      <TableCell>{item.contratos?.fornecedores?.nome}</TableCell>
      <TableCell className="text-right">{item.quantidade}</TableCell>
      <TableCell className="text-right">{item.quantidade_consumida}</TableCell>
      <TableCell>{item.unidade}</TableCell>
      <TableCell className="text-right">
        {formatCurrency(item.valor_unitario)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(item.quantidade * item.valor_unitario)}
      </TableCell>
      <TableCell className="text-right">
        <TableActions
          onEdit={() => onEdit?.(item)}
          onDelete={() => onDelete?.(item)}
          showDelete={item.quantidade_consumida === 0}
          showEdit={true}
          disableDelete={item.quantidade_consumida > 0}
          deleteTooltip={
            item.quantidade_consumida > 0
              ? "Não é possível excluir um item que já foi consumido"
              : undefined
          }
        />
      </TableCell>
    </TableRow>
  );
};
