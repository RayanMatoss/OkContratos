import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { OrdemSolicitacao, OrdemSolicitacaoStatus } from "@/types";
import { useAuth } from "@/hooks/useAuth";
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
  const { perfil } = useAuth();
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<OrdemSolicitacao | null>(null);
  const [showAprovarDialog, setShowAprovarDialog] = useState(false);
  const [showRecusarDialog, setShowRecusarDialog] = useState(false);
  const [numero, setNumero] = useState("");
  const [dataEmissao, setDataEmissao] = useState(new Date());
  const [motivo, setMotivo] = useState("");

  const isAdmin = perfil === "admin" || perfil === "mestre";

  const handleAprovar = async () => {
    if (!selectedSolicitacao || !numero || !motivo) return;

    try {
      // TODO: Implementar função RPC para aprovar solicitação
      console.log("Aprovar solicitação:", selectedSolicitacao.id, numero, dataEmissao, motivo);
      
      setShowAprovarDialog(false);
      setSelectedSolicitacao(null);
      setNumero("");
      setDataEmissao(new Date());
      setMotivo("");
      onRefresh();
    } catch (error) {
      console.error("Erro ao aprovar:", error);
    }
  };

  const handleRecusar = async () => {
    if (!selectedSolicitacao || !motivo) return;

    try {
      // TODO: Implementar função RPC para recusar solicitação
      console.log("Recusar solicitação:", selectedSolicitacao.id, motivo);
      
      setShowRecusarDialog(false);
      setSelectedSolicitacao(null);
      setMotivo("");
      onRefresh();
    } catch (error) {
      console.error("Erro ao recusar:", error);
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSolicitacao(solicitacao);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {isAdmin && solicitacao.status === "PENDENTE" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedSolicitacao(solicitacao);
                              setShowAprovarDialog(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedSolicitacao(solicitacao);
                              setShowRecusarDialog(true);
                            }}
                          >
                            <XCircle className="w-4 h-4" />
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

      {/* Dialog para Aprovar Solicitação */}
      <Dialog open={showAprovarDialog} onOpenChange={setShowAprovarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Solicitação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="numero">Número da Ordem</Label>
              <Input
                id="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ex: 001/2024"
              />
            </div>
            <div>
              <Label htmlFor="dataEmissao">Data de Emissão</Label>
              <Input
                id="dataEmissao"
                type="date"
                value={dataEmissao.toISOString().split('T')[0]}
                onChange={(e) => setDataEmissao(new Date(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="motivo">Motivo da Aprovação</Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Descreva o motivo da aprovação"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAprovarDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAprovar}>
                Aprovar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              <Button variant="outline" onClick={() => setShowRecusarDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleRecusar}>
                Recusar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
