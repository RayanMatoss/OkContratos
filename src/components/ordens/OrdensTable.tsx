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
import { gerarPdfOrdem } from "@/lib/pdf/gerarPdfOrdem";
import { Download } from "lucide-react";
import { buscarItensOrdemDetalhados } from "@/lib/pdf/buscarItensOrdemDetalhados";
import { useAuth } from "@/hooks/useAuth";

interface OrdensTableProps {
  ordens: OrdemFornecimento[];
  loading: boolean;
  onEdit: (ordem: OrdemFornecimento) => void;
  onDelete: (ordem: OrdemFornecimento) => void;
}

const OrdensTable = ({ 
  ordens, 
  loading,
  onEdit,
  onDelete 
}: OrdensTableProps) => {
  const { secretariaAtiva } = useAuth();
  
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
          {ordens.length > 0 ? (
            ordens.map((ordem) => {
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
                                // Usar os itens que já estão carregados na ordem
                                const itensParaPdf = ordem.itens?.map(item => ({
                                  descricao: item.item?.descricao || "Item não encontrado",
                                  quantidade: item.quantidade || 0,
                                  unidade: item.item?.unidade || "UN",
                                  valor_unitario: item.valorUnitario || 0
                                })) || [];

                                // Configuração do timbre baseada na secretaria ativa do usuário logado
                                const secretaria = secretariaAtiva || 'prefeitura';
                                const timbreConfig = {
                                  secretaria: secretaria
                                  // Posição e tamanho vêm do timbreConfig.ts por padrão
                                };

                                gerarPdfOrdem(
                                  {
                                    ...ordem,
                                    data_emissao: ordem.dataEmissao
                                  },
                                  ordem.contrato,
                                  ordem.contrato?.fornecedor,
                                  itensParaPdf,
                                  timbreConfig
                                );
                              }}
                            >
                              <Download size={18} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Baixar PDF</TooltipContent>
                        </Tooltip>
                      </div>
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
