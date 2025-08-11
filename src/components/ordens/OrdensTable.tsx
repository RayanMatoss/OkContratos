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
<<<<<<< HEAD
<<<<<<< HEAD
import { gerarPdfOrdem } from "@/lib/pdf/gerarPdfOrdem";
import { Download } from "lucide-react";
import { buscarItensOrdemDetalhados } from "@/lib/pdf/buscarItensOrdemDetalhados";
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
import { gerarPdfOrdem } from "@/lib/pdf/gerarPdfOrdem";
import { Download } from "lucide-react";
import { buscarItensOrdemDetalhados } from "@/lib/pdf/buscarItensOrdemDetalhados";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

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
<<<<<<< HEAD
<<<<<<< HEAD
=======
              // Permitir editar e excluir qualquer ordem
              const canEdit = true;
              const canDelete = true;
              
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
                      <div className="flex items-center justify-end gap-1">
                        <TableActions
                          onEdit={() => onEdit(ordem)}
                          onDelete={() => onDelete(ordem)}
                          showEdit={true}
                          showDelete={true}
                          disableDelete={false}
                          disableEdit={false}
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="p-1 rounded hover:bg-muted transition"
                              title="Baixar PDF"
                              onClick={async () => {
                                const itensDetalhados = await buscarItensOrdemDetalhados(ordem.id);
                                gerarPdfOrdem(
                                  {
                                    ...ordem,
                                    data_emissao: ordem.dataEmissao
                                  },
                                  ordem.contrato,
                                  ordem.contrato?.fornecedor,
                                  itensDetalhados
                                );
                              }}
                            >
                              <Download size={18} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Baixar PDF</TooltipContent>
                        </Tooltip>
                      </div>
<<<<<<< HEAD
=======
                      <TableActions
                        onEdit={() => onEdit(ordem)}
                        onDelete={() => onDelete(ordem)}
                        showEdit={true}
                        showDelete={true}
                        disableDelete={false}
                        disableEdit={false}
                        deleteTooltip={undefined}
                        editTooltip={undefined}
                      />
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======

>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
