import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Contrato } from "@/types";
import AditivosTab from "./AditivosTab";

interface ContratoDetalhesProps {
  contrato: Contrato;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContratoDetalhes = ({ contrato, open, onOpenChange }: ContratoDetalhesProps) => {
  console.log("Contrato recebido no modal:", contrato);
  const fundos =
    Array.isArray(contrato.fundoMunicipal) && contrato.fundoMunicipal.length > 0
      ? contrato.fundoMunicipal
      : Array.isArray(contrato.fundo_municipal) && contrato.fundo_municipal.length > 0
      ? contrato.fundo_municipal
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Contrato</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Número</h3>
              <p className="text-lg font-medium">{contrato.numero}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fornecedor</h3>
              <p className="text-lg font-medium">{contrato.fornecedor?.nome}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Objeto</h3>
              <p className="text-lg font-medium">{contrato.objeto}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Valor</h3>
              <p className="text-lg font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(contrato.valor)}
              </p>
            </div>
            {/* Fundos - só exibe se houver */}
            {fundos.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Fundos</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {fundos.map((fundo, index) => (
                    <Badge key={index} variant="secondary">
                      {fundo}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Vigência</h3>
              <p className="text-lg font-medium">
                {format(new Date(contrato.dataInicio), 'dd/MM/yyyy')} a{' '}
                {format(new Date(contrato.dataTermino), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>

          {/* Itens do Contrato */}
          <div>
            <h3 className="text-lg font-medium mb-4">Itens do Contrato</h3>
            <div className="border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Descrição</th>
                    <th className="text-center p-2">Quantidade</th>
                    <th className="text-center p-2">Unidade</th>
                    <th className="text-right p-2">Valor Unitário</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {contrato.itens?.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-2">{item.descricao}</td>
                      <td className="text-center p-2">{item.quantidade}</td>
                      <td className="text-center p-2">{item.unidade}</td>
                      <td className="text-right p-2">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.valorUnitario)}
                      </td>
                      <td className="text-right p-2">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.quantidade * item.valorUnitario)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Aditivos */}
          <div>
            <h3 className="text-lg font-medium mb-4">Aditivos</h3>
            <AditivosTab contratoId={contrato.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContratoDetalhes; 