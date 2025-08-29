import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { OrdemSolicitacao } from "@/types";
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface OrdensTableProps {
  ordens: OrdemSolicitacao[];
  loading: boolean;
  onEdit: (ordem: OrdemSolicitacao) => void;
  onDelete: (ordem: OrdemSolicitacao) => void;
}

export const OrdensTable = ({ ordens, loading, onEdit, onDelete }: OrdensTableProps) => {
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
                  <TableCell className="font-medium">{ordem.numero_ordem || 'N/A'}</TableCell>
                  <TableCell>{ordem.contrato?.numero || 'N/A'}</TableCell>
                  <TableCell>
                    {ordem.decidido_em 
                      ? format(new Date(ordem.decidido_em), 'dd/MM/yyyy')
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>{ordem.contrato?.fornecedor?.nome || 'N/A'}</TableCell>
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
                                try {
                                  // Buscar os itens reais da solicitação
                                  const { data: itensData, error: itensError } = await supabase
                                    .from('view_solicitacoes_com_itens')
                                    .select('*')
                                    .eq('solicitacao_id', ordem.id);

                                  if (itensError) {
                                    console.error('Erro ao buscar itens:', itensError);
                                    return;
                                  }

                                  // Filtrar apenas registros com itens e transformar para o formato do PDF
                                  const itensParaPdf = (itensData || [])
                                    .filter(item => item.item_id !== null)
                                    .map(item => ({
                                      descricao: item.descricao_item || 'Item sem descrição',
                                      quantidade: item.quantidade_item || 0,
                                      unidade: item.unidade || 'UN',
                                      valor_unitario: item.valor_unitario || 0,
                                      valor_total: (item.quantidade_item || 0) * (item.valor_unitario || 0)
                                    }));

                                  // Usar a secretaria da solicitação (não a do usuário logado)
                                  const secretaria = ordem.secretaria?.toLowerCase() || 'prefeitura';
                                  const timbreConfig = {
                                    secretaria: secretaria
                                  };

                                  // Criar objeto completo para o PDF
                                  const ordemParaPdf = {
                                    id: ordem.id,
                                    numero: ordem.numero_ordem || 'N/A',
                                    data_emissao: ordem.decidido_em || ordem.criado_em,
                                    contrato: ordem.contrato,
                                    fornecedor: ordem.contrato?.fornecedor,
                                    secretaria: ordem.secretaria,
                                    solicitante: ordem.solicitante,
                                    justificativa: ordem.justificativa
                                  };

                                  console.log('🔍 Gerando PDF com:', { ordemParaPdf, itensParaPdf, timbreConfig });

                                  await gerarPdfOrdem(
                                    ordemParaPdf,
                                    ordem.contrato,
                                    ordem.contrato?.fornecedor,
                                    itensParaPdf,
                                    timbreConfig
                                  );
                                } catch (error) {
                                  console.error('Erro ao gerar PDF:', error);
                                }
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
