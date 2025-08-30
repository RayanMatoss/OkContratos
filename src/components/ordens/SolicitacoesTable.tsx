import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, Clock, Check, X } from "lucide-react";
import { OrdemSolicitacao, OrdemSolicitacaoStatus } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useAprovarSolicitacao } from "@/hooks/useAprovarSolicitacao";
import { useRecusarSolicitacao } from "@/hooks/useRecusarSolicitacao";
import { useItensSolicitacao } from "@/hooks/useItensSolicitacao";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface SolicitacoesTableProps {
  solicitacoes: OrdemSolicitacao[];
  loading: boolean;
  onRefresh: () => void;
}

export const SolicitacoesTable: React.FC<SolicitacoesTableProps> = ({
  solicitacoes,
  loading,
  onRefresh
}) => {
  const { perfil, user } = useAuth();
  const { toast } = useToast();
  const { aprovar, loading: aprovarLoading } = useAprovarSolicitacao();
  const { recusar, loading: recusarLoading } = useRecusarSolicitacao();
  
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<OrdemSolicitacao | null>(null);
  
  // Hook para buscar itens da solicitação
  const { itens, loading: loadingItens, valorTotal, quantidadeTotal, refetch: refetchItens } = useItensSolicitacao(selectedSolicitacao?.id || null);
  const [showRecusarDialog, setShowRecusarDialog] = useState(false);
  const [motivo, setMotivo] = useState("");

  const isAdmin = perfil === "admin" || perfil === "Admin" || perfil === "ADMIN" || 
                  perfil === "mestre" || perfil === "Mestre" || perfil === "MESTRE";

  const handleAprovar = async () => {
    if (!selectedSolicitacao || !user?.id) {
      toast({
        title: "Dados incompletos",
        description: "Usuário não identificado",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await aprovar({
        solicitacao_id: selectedSolicitacao.id,
        aprovador_id: user.id,
      });

      if (result.success) {
        toast({
          title: "Solicitação aprovada",
          description: `Aprovada com sucesso! Número da ordem: ${result.numero_ordem}`,
        });
        
        setSelectedSolicitacao(null);
        onRefresh(); // Recarregar lista de solicitações
        refetchItens(); // Recarregar itens se necessário
      } else {
        toast({
          title: "Erro ao aprovar",
          description: 'error' in result ? result.error : "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao aprovar:", error);
      toast({
        title: "Erro ao aprovar",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleRecusar = async () => {
    if (!selectedSolicitacao || !motivo || !user?.id) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await recusar({
        solicitacao_id: selectedSolicitacao.id,
        recusador_id: user.id,
        motivo_decisao: motivo,
      });

      if (result.success) {
        toast({
          title: "Solicitação recusada",
          description: result.message,
        });
        
        setShowRecusarDialog(false);
        setSelectedSolicitacao(null);
        setMotivo("");
        onRefresh();
      } else {
        toast({
          title: "Erro ao recusar",
          description: 'error' in result ? result.error : "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao recusar:", error);
      toast({
        title: "Erro ao recusar",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: OrdemSolicitacaoStatus) => {
    switch (status) {
      case "PENDENTE":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pendente</Badge>;
      case "APROVADA":
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Aprovada</Badge>;
      case "RECUSADA":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Recusada</Badge>;
      case "CANCELADA":
        return <Badge variant="outline" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Carregando solicitações...</p>
        </div>
      </div>
    );
  }

  if (solicitacoes.length === 0) {
    return (
      <div className="text-center p-8">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação encontrada</h3>
        <p className="text-muted-foreground">Não há solicitações de ordem de fornecimento no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Justificativa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitacoes.map((solicitacao) => (
                <TableRow key={solicitacao.id}>
                  <TableCell>
                    {solicitacao.contrato?.numero || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {solicitacao.contrato?.fornecedor?.nome || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {new Date(solicitacao.criado_em).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {solicitacao.justificativa || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(solicitacao.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Botão Visualizar - sempre visível */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSolicitacao(solicitacao);
                        }}
                        title="Ver detalhes da solicitação"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {/* Botões de Ação - apenas para admin e solicitações pendentes */}
                      {isAdmin && solicitacao.status === "PENDENTE" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedSolicitacao(solicitacao);
                              handleAprovar();
                            }}
                            title="Aprovar solicitação"
                            disabled={aprovarLoading}
                          >
                            {aprovarLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedSolicitacao(solicitacao);
                              setShowRecusarDialog(true);
                            }}
                            title="Recusar solicitação"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>



      {/* Dialog para Recusar Solicitação */}
      <Dialog open={showRecusarDialog} onOpenChange={setShowRecusarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recusar Solicitação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motivoRecusa">Motivo da Recusa</Label>
              <Textarea
                id="motivoRecusa"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Descreva o motivo da recusa"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRecusarDialog(false)} disabled={recusarLoading}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleRecusar} disabled={recusarLoading}>
                {recusarLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Recusando...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Recusar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhado da Solicitação */}
      <Dialog open={!!selectedSolicitacao} onOpenChange={(open) => !open && setSelectedSolicitacao(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detalhes da Solicitação
            </DialogTitle>
          </DialogHeader>
          
          {selectedSolicitacao && (
            <div className="space-y-6">
              {/* Informações Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div>{getStatusBadge(selectedSolicitacao.status)}</div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
                  <div className="text-sm">
                    {new Date(selectedSolicitacao.criado_em).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(selectedSolicitacao.criado_em).toLocaleTimeString('pt-BR')}
                  </div>
                </div>
              </div>

              {/* Informações do Contrato */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">Informações do Contrato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Número do Contrato</Label>
                    <div className="text-sm font-medium">
                      {selectedSolicitacao.contrato?.numero || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Fornecedor</Label>
                    <div className="text-sm font-medium">
                      {selectedSolicitacao.contrato?.fornecedor?.nome || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Justificativa */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">Justificativa da Solicitação</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {selectedSolicitacao.justificativa || 'Nenhuma justificativa fornecida'}
                  </p>
                </div>
              </div>

              {/* Itens da Solicitação */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">Itens da Solicitação</h3>
                
                {loadingItens ? (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Carregando itens da solicitação...</p>
                    </div>
                  </div>
                ) : itens && itens.length > 0 ? (
                  <div className="space-y-4">
                    {/* Tabela de Itens */}
                    <div className="bg-muted/30 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium">Item</th>
                            <th className="text-left p-3 text-sm font-medium">Descrição</th>
                            <th className="text-center p-3 text-sm font-medium">Qtd</th>
                            <th className="text-center p-3 text-sm font-medium">Unidade</th>
                            <th className="text-right p-3 text-sm font-medium">Valor Unit.</th>
                            <th className="text-right p-3 text-sm font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itens.map((item, index) => (
                            <tr key={item.id} className="border-b border-muted/30 hover:bg-muted/20">
                              <td className="p-3 text-sm font-medium">#{index + 1}</td>
                              <td className="p-3 text-sm max-w-xs truncate" title={item.item?.descricao}>
                                {item.item?.descricao || 'N/A'}
                              </td>
                              <td className="p-3 text-sm text-center">{item.quantidade}</td>
                              <td className="p-3 text-sm text-center">{item.item?.unidade || 'N/A'}</td>
                              <td className="p-3 text-sm text-right">
                                {item.item?.valor_unitario ? formatCurrency(item.item.valor_unitario) : 'N/A'}
                              </td>
                              <td className="p-3 text-sm text-right font-medium">
                                {item.item?.valor_unitario ? formatCurrency(item.quantidade * item.item.valor_unitario) : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Resumo Financeiro */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Quantidade Total</p>
                          <p className="text-xl font-bold text-primary">{quantidadeTotal} unidades</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Total</p>
                          <p className="text-xl font-bold text-primary">{formatCurrency(valorTotal)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Itens</p>
                          <p className="text-xl font-bold text-primary">{itens.length} tipos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-center text-muted-foreground py-8">
                      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h4 className="text-lg font-medium mb-2">Nenhum item encontrado</h4>
                      <p className="text-sm">
                        Esta solicitação não possui itens específicos cadastrados.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantidade Total */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">Resumo da Solicitação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Quantidade Total Solicitada</Label>
                    <div className="text-2xl font-bold text-primary">
                      {selectedSolicitacao.quantidade || 0} unidades
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Secretaria</Label>
                    <div className="text-sm font-medium">
                      {selectedSolicitacao.secretaria || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações para Usuário Mestre */}
              {isAdmin && selectedSolicitacao.status === "PENDENTE" && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-2">Ações Administrativas</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={handleAprovar}
                      disabled={aprovarLoading}
                    >
                      {aprovarLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Aprovando...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Aprovar Solicitação
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setShowRecusarDialog(true);
                      }}
                      disabled={recusarLoading}
                    >
                      {recusarLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Recusando...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Recusar Solicitação
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    ⚠️ Esta ação não pode ser desfeita após a confirmação
                  </p>
                </div>
              )}

              {/* Botão Fechar */}
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedSolicitacao(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
