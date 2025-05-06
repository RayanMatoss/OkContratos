import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ItemForm } from "./ItemForm";
import { ItemsList } from "./ItemsList";
import { Contrato } from "@/types";

interface NewItem {
  descricao: string;
  quantidade: string;
  unidade: string;
  valor_unitario: string;
}

interface AddItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  contratos: Pick<Contrato, 'id' | 'numero' | 'objeto'>[];
}

export const AddItemsDialog = ({ open, onOpenChange, onSuccess, contratos }: AddItemsDialogProps) => {
  const { toast } = useToast();
  const [selectedContrato, setSelectedContrato] = useState("");
  const [itemsList, setItemsList] = useState<any[]>([]);

  const handleAddItem = (newItem: any) => {
    setItemsList([...itemsList, newItem]);
  };

  const handleSubmitItems = async () => {
    if (!selectedContrato || itemsList.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione um contrato e adicione pelo menos um item",
        variant: "destructive"
      });
      return;
    }

    try {
      const itemsToAdd = itemsList.map(item => ({
        contrato_id: selectedContrato,
        descricao: item.descricao,
        quantidade: parseFloat(item.quantidade),
        unidade: item.unidade,
        valor_unitario: parseFloat(item.valor_unitario),
        quantidade_consumida: 0,
        fundos: Array.isArray(item.fundos)
          ? item.fundos
          : (typeof item.fundos === "string" && item.fundos ? [item.fundos] : []),
      }));

      const { error } = await supabase.from('itens').insert(itemsToAdd);

      if (error) throw error;

      onOpenChange(false);
      toast({
        title: "Sucesso",
        description: "Itens adicionados com sucesso."
      });
      
      setItemsList([]);
      setSelectedContrato("");
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar Novos Itens</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contrato">Contrato</Label>
              <select
                id="contrato"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedContrato}
                onChange={(e) => setSelectedContrato(e.target.value)}
              >
                <option value="">Selecione um contrato</option>
                {contratos.map(contrato => (
                  <option key={contrato.id} value={contrato.id}>
                    {contrato.numero} - {contrato.objeto}
                  </option>
                ))}
              </select>
            </div>
            
            <ItemForm onAdd={handleAddItem} />
            
            <ItemsList items={itemsList} />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            setItemsList([]);
            setSelectedContrato("");
          }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitItems}>Salvar Itens</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
