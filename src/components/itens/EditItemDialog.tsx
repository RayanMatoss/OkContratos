import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FundoMunicipalSelector from "@/components/contratos/FundoMunicipalSelector";
import { FundoMunicipal } from "@/types";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  item: {
    id: string;
    descricao: string;
    quantidade: number;
    unidade: string;
    valor_unitario: number;
    quantidade_consumida: number;
    fundos?: string[];
    contratos?: {
      numero: string;
      objeto: string;
      fundoMunicipal?: FundoMunicipal[];
    };
  };
}

export const EditItemDialog = ({ open, onOpenChange, onSuccess, item }: EditItemDialogProps) => {
  const { toast } = useToast();
  const [descricao, setDescricao] = useState(item.descricao);
  const [quantidade, setQuantidade] = useState(String(item.quantidade));
  const [unidade, setUnidade] = useState(item.unidade);
  const [valorUnitario, setValorUnitario] = useState(String(item.valor_unitario));
  const [fundos, setFundos] = useState<string[]>(
    Array.isArray(item.fundos) ? item.fundos : []
  );

  const handleSubmit = async () => {
    try {
      if (Number(quantidade) < item.quantidade_consumida) {
        throw new Error("A quantidade não pode ser menor que a quantidade já consumida");
      }

      const { error } = await supabase
        .from('itens')
        .update({
          descricao,
          quantidade: Number(quantidade),
          unidade,
          valor_unitario: Number(valorUnitario),
          fundos: fundos
        })
        .eq('id', item.id)
        .eq('quantidade_consumida', item.quantidade_consumida);

      if (error) throw error;

      toast({
        title: "Item atualizado",
        description: "O item foi atualizado com sucesso"
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar item",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        
        {item.contratos && (
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="font-medium">Contrato: {item.contratos.numero}</p>
            <p className="text-sm text-muted-foreground">{item.contratos.objeto}</p>
          </div>
        )}

        <div className="grid gap-4 py-4">
          
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">
                Quantidade
                {item.quantidade_consumida > 0 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (Consumido: {item.quantidade_consumida})
                  </span>
                )}
              </Label>
              <Input
                id="quantidade"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Input
                id="unidade"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Unitário</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
              />
            </div>
          </div>
          
          
          <div className="space-y-2">
            <Label>Fundos Relacionados</Label>
            <FundoMunicipalSelector
              selectedFundos={fundos}
              onChange={setFundos}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
