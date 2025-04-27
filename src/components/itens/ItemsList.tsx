
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface Item {
  descricao: string;
  quantidade: string;
  unidade: string;
  valor_unitario: string;
}

interface ItemsListProps {
  items: Item[];
}

export const ItemsList = ({ items }: ItemsListProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Nenhum item adicionado à lista
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead className="text-right">Valor Unit.</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.descricao}</TableCell>
              <TableCell className="text-right">{item.quantidade}</TableCell>
              <TableCell>{item.unidade}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(Number(item.valor_unitario))}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(Number(item.quantidade) * Number(item.valor_unitario))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
