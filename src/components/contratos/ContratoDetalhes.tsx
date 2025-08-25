
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Contrato } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AditivoFormDialog from "./AditivoFormDialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useContratoSaldo } from "@/hooks/useContratoSaldo";
import { useAuth } from "@/hooks/useAuth";
import ContratosRelacionados from "./ContratosRelacionados";

interface ContratoDetalhesProps {
  contrato: Contrato;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAditivoCriado?: () => void;
}

const ContratoDetalhes = ({ contrato, open, onOpenChange, onAditivoCriado }: ContratoDetalhesProps) => {
  const { fundosSelecionados } = useAuth();
  
  // Filtrar fundos municipais baseado nos fundos selecionados no login
  const fundosFiltrados = Array.isArray(contrato.fundoMunicipal) && contrato.fundoMunicipal.length > 0
    ? contrato.fundoMunicipal.filter(fundo => {
        const fundoStr = typeof fundo === 'string' ? fundo : String(fundo);
        
        // Se não há fundos selecionados, mostrar todos os fundos do contrato
        if (!fundosSelecionados || fundosSelecionados.length === 0) {
          return true;
        }
        
        // Comparação direta, case-insensitive e removendo espaços extras
        const fundoNormalizado = fundoStr.toLowerCase().trim();
        return fundosSelecionados.some(fundoSelecionado => {
          const selecionadoNormalizado = fundoSelecionado.toLowerCase().trim();
          return fundoNormalizado === selecionadoNormalizado;
        });
      })
    : [];

  // Se o contrato não tem fundos associados, usar os fundos do usuário logado
  const fundosString = fundosFiltrados.length > 0 
    ? fundosFiltrados.map(f => typeof f === 'string' ? f : String(f)).join(', ')
    : (fundosSelecionados && fundosSelecionados.length > 0 
        ? fundosSelecionados.join(', ')
        : 'Nenhum fundo disponível para este usuário');

  const { toast } = useToast();
  const [showAditivoForm, setShowAditivoForm] = useState(false);
  const { saldo, loading: loadingSaldo } = useContratoSaldo(contrato.id);

  const handleAditivoSuccess = () => {
    setShowAditivoForm(false);
    toast({
      title: "Aditivo criado",
      description: "O aditivo foi criado com sucesso",
    });
    onAditivoCriado?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Detalhes do Contrato</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o contrato selecionado.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="grid gap-4 py-4 pr-4">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium leading-none">Número do Contrato</div>
                <p className="text-sm text-muted-foreground">
                  {contrato.numeroCompleto || contrato.numero}
                </p>
              </div>
              <div>
                <div className="text-sm font-medium leading-none">Fornecedores</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {contrato.fornecedores && contrato.fornecedores.length > 0 ? (
                    contrato.fornecedores.map((fornecedor) => (
                      <Badge key={fornecedor.id} variant="secondary" className="text-xs">
                        {fornecedor.nome}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">Nenhum fornecedor</span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações Financeiras */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valor Original
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {contrato.valor?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    Valor Consumido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {saldo.valorConsumido.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {saldo.percentualConsumido.toFixed(1)}% do total
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Saldo Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {saldo.saldoAtual.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Disponível para uso
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso do Contrato</span>
                <span>{saldo.percentualConsumido.toFixed(1)}%</span>
              </div>
              <Progress value={saldo.percentualConsumido} className="h-2" />
            </div>

            {/* Informações do Contrato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium leading-none">Objeto</div>
                <p className="text-sm text-muted-foreground">{contrato.objeto}</p>
              </div>
              <div>
                <div className="text-sm font-medium leading-none">Fundo Municipal</div>
                <p className="text-sm text-muted-foreground">{fundosString}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium leading-none">Data de Início</div>
                <p className="text-sm text-muted-foreground">
                  {format(contrato.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div>
                <div className="text-sm font-medium leading-none">Data de Término</div>
                <p className="text-sm text-muted-foreground">
                  {format(contrato.dataTermino, "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div>
                <div className="text-sm font-medium leading-none">Status</div>
                <Badge
                  variant="secondary"
                  className={
                    contrato.status === "Ativo"
                      ? "bg-green-500 text-white"
                      : contrato.status === "Expirado"
                        ? "bg-red-500 text-white"
                        : contrato.status === "Suspenso"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-500 text-white"
                  }
                >
                  {contrato.status}
                </Badge>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium leading-none">Criado em</div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(contrato.createdAt, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>

            {/* Itens do Contrato */}
            <div>
              <div className="text-sm font-medium leading-none">Itens do Contrato</div>
              <div className="mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Quantidade Original</TableHead>
                      <TableHead>Quantidade Consumida</TableHead>
                      <TableHead>Saldo Quantidade</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Valor Unitário</TableHead>
                      <TableHead>Valor Total Original</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {saldo.itensSaldo && saldo.itensSaldo.length > 0 ? (
                      saldo.itensSaldo.map((itemSaldo) => {
                        return (
                          <TableRow key={itemSaldo.id}>
                            <TableCell className="font-medium">{itemSaldo.descricao}</TableCell>
                            <TableCell>{itemSaldo.quantidadeOriginal.toLocaleString('pt-BR')}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={itemSaldo.quantidadeConsumida > 0 ? "text-red-500" : "text-muted-foreground"}>
                                  {itemSaldo.quantidadeConsumida.toLocaleString('pt-BR')}
                                </span>
                                {itemSaldo.percentualConsumido > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {itemSaldo.percentualConsumido.toFixed(1)}%
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={itemSaldo.saldoQuantidade < itemSaldo.quantidadeOriginal * 0.2 ? "text-red-500 font-bold" : "text-green-600 font-medium"}>
                                  {itemSaldo.saldoQuantidade.toLocaleString('pt-BR')}
                                </span>
                                {itemSaldo.saldoQuantidade < itemSaldo.quantidadeOriginal * 0.2 && itemSaldo.saldoQuantidade > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    Baixo
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{itemSaldo.unidade || '-'}</TableCell>
                            <TableCell>
                              {itemSaldo.valorUnitario.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </TableCell>
                            <TableCell>
                              {(itemSaldo.quantidadeOriginal * itemSaldo.valorUnitario).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Nenhum item adicionado a este contrato.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Total Geral */}
            {contrato.itens && contrato.itens.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Geral dos Itens:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {saldo.itensSaldo.length > 0 
                      ? saldo.itensSaldo
                          .reduce((total, itemSaldo) => total + (itemSaldo.quantidadeOriginal * itemSaldo.valorUnitario), 0)
                          .toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                      : contrato.itens
                          .reduce((total, item) => total + ((item.quantidade || 0) * (item.valorUnitario || 0)), 0)
                          .toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Contratos Relacionados */}
            <ContratosRelacionados 
              contratoId={contrato.id}
              onViewContrato={(id) => {
                // Aqui você pode implementar a lógica para abrir outro contrato
                console.log('Visualizar contrato relacionado:', id);
              }}
            />
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setShowAditivoForm(true)}>
            <Plus size={16} className="mr-2" />
            Novo Aditivo
          </Button>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
              <AditivoFormDialog
          contratoId={contrato.id}
          open={showAditivoForm}
          onOpenChange={setShowAditivoForm}
          onSuccess={handleAditivoSuccess}
        />
    </Dialog>
  );
};

export default ContratoDetalhes;
