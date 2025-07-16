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
import { Edit, Eye, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AditivoForm from "./AditivoForm";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContratoDetalhesProps {
  contrato: Contrato;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAditivoCriado?: () => void;
}

const ContratoDetalhes = ({ contrato, open, onOpenChange, onAditivoCriado }: ContratoDetalhesProps) => {
  const fundosString = Array.isArray(contrato.fundoMunicipal) 
    ? contrato.fundoMunicipal.map(f => typeof f === 'string' ? f : f.toString()).join(', ')
    : contrato.fundoMunicipal?.toString() || '';

  const { toast } = useToast();
  const [showAditivoForm, setShowAditivoForm] = useState(false);

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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Contrato</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o contrato selecionado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium leading-none">Número do Contrato</div>
              <p className="text-sm text-muted-foreground">{contrato.numero}</p>
            </div>
            <div>
              <div className="text-sm font-medium leading-none">Fornecedor</div>
              <p className="text-sm text-muted-foreground">{contrato.fornecedor?.nome}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium leading-none">Objeto</div>
              <p className="text-sm text-muted-foreground">{contrato.objeto}</p>
            </div>
            <div>
              <div className="text-sm font-medium leading-none">Valor</div>
              <p className="text-sm text-muted-foreground">
                {contrato.valor?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <div className="text-sm font-medium leading-none">Criado em</div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(contrato.createdAt, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium leading-none">Fundo Municipal</div>
            <p className="text-sm text-muted-foreground">{fundosString}</p>
          </div>
          <div>
            <div className="text-sm font-medium leading-none">Itens do Contrato</div>
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Valor Unitário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contrato.itens && contrato.itens.length > 0 ? (
                    contrato.itens.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell>{item.unidade}</TableCell>
                        <TableCell>
                          {item.valor_unitario?.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Nenhum item adicionado a este contrato.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowAditivoForm(true)}>
            <Plus size={16} className="mr-2" />
            Novo Aditivo
          </Button>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
      <AditivoForm
        contratoId={contrato.id}
        open={showAditivoForm}
        onOpenChange={setShowAditivoForm}
        onSuccess={handleAditivoSuccess}
      />
    </Dialog>
  );
};

export default ContratoDetalhes;
