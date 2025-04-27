
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { ordens } from "@/data/mockData";
import { format } from "date-fns";
import { OrdemFornecimento } from "@/types";

interface OrdensTableProps {
  filteredOrdens: OrdemFornecimento[];
}

const OrdensTable = ({ filteredOrdens }: OrdensTableProps) => {
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
              </TableRow>
            ))
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
