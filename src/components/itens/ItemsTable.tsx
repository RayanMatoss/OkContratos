
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Item } from "@/types";

// This interface matches what comes from the database
interface ItemTableResponse {
  id: string;
  contrato_id: string;
  descricao: string;
  quantidade: number;
  quantidade_consumida: number;
  unidade: string;
  valor_unitario: number;
  contratos?: {
    numero: string;
    fornecedores?: {
      nome: string;
    };
  };
}

interface ItemsTableProps {
  items: ItemTableResponse[];
  loading: boolean;
}

export const ItemsTable = ({ items, loading }: ItemsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Contrato</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">Consumido</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead className="text-right">Valor Unit.</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                {loading ? "Carregando itens..." : "Nenhum item encontrado."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
