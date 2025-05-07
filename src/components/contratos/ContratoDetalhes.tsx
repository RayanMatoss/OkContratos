import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Contrato } from "@/types";
import AditivosTab from "./AditivosTab";

interface ContratoDetalhesProps {
  contrato: Contrato;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAditivoCriado?: () => void;
}

const ContratoDetalhes = ({ contrato, open, onOpenChange, onAditivoCriado }: ContratoDetalhesProps) => {
  console.log("Contrato recebido no modal:", contrato);
  const fundos =
    Array.isArray(contrato.fundoMunicipal) && contrato.fundoMunicipal.length > 0
      ? contrato.fundoMunicipal
      : Array.isArray(contrato.fundo_municipal) && contrato.fundo_municipal.length > 0
      ? contrato.fundo_municipal
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Contrato</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
            <div className="md:col-span-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">Número</h3>
              <p className="text-base font-bold">{contrato.numero}</p>
            </div>
            <div className="md:col-span-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">Fornecedor</h3>
              <p className="text-base font-bold">{contrato.fornecedor?.nome}</p>
            </div>
            <div className="md:col-span-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">Valor</h3>
              <p className="text-base font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(contrato.valor)}
              </p>
            </div>
            <div className="md:col-span-8 mt-2">
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">Objeto</h3>
              <p className="text-sm leading-snug">{contrato.objeto}</p>
            </div>
            <div className="md:col-span-2 mt-2">
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">Fundos</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {fundos.map((fundo, index) => (
                  <Badge key={index} variant="secondary">
                    {fundo}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 mt-2">
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">Vigência</h3>
              <p className="text-sm font-medium">
                {format(new Date(contrato.dataInicio), 'dd/MM/yyyy')} a{' '}
                {format(new Date(contrato.dataTermino), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>

          {/* Itens do Contrato */}
          <div>
            <h3 className="text-base font-semibold mb-2">Itens do Contrato</h3>
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
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
            <h3 className="text-base font-semibold mb-2">Aditivos</h3>
            <AditivosTab contratoId={contrato.id} onAditivoCriado={onAditivoCriado} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContratoDetalhes; 