
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { contratos } from "@/data/mockData";
import DatePickerField from "@/components/contratos/DatePickerField";
import { supabase } from "@/integrations/supabase/client";
import OrdemItemsSelection from "./OrdemItemsSelection";

interface AddOrdemFormProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddOrdemForm = ({ showDialog, onOpenChange }: AddOrdemFormProps) => {
  const [newOrdem, setNewOrdem] = useState({
    numero: "",
    contratoId: "",
    dataEmissao: new Date(),
    itensConsumidos: [] as { itemId: string; quantidade: number }[]
  });

  const handleAddOrdem = async () => {
    try {
      const { data: ordem, error: orderError } = await supabase.from('ordens').insert([{
        numero: newOrdem.numero,
        contrato_id: newOrdem.contratoId,
        data_emissao: newOrdem.dataEmissao.toISOString(),
      }]).select().single();

      if (orderError) throw orderError;

      const itemsToInsert = newOrdem.itensConsumidos.map(item => ({
        ordem_id: ordem.id,
        item_id: item.itemId,
        quantidade: item.quantidade
      }));

      const { error: itemsError } = await supabase
        .from('itens_consumidos')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      for (const item of newOrdem.itensConsumidos) {
        const { error: updateError } = await supabase.rpc('update_item_quantity', {
          p_item_id: item.itemId,
          p_quantidade: item.quantidade
        });
        
        if (updateError) throw updateError;
      }

      onOpenChange(false);
      window.location.reload();
      toast.success("Ordem de fornecimento cadastrada com sucesso");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const selectedContrato = contratos.find((c) => c.id === newOrdem.contratoId);
  const contratoItens = selectedContrato?.itens || [];

  return (
    <Dialog open={showDialog} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Fornecimento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número da Ordem</Label>
              <Input
                id="numero"
                placeholder="OF-2023/001"
                value={newOrdem.numero}
                onChange={(e) =>
                  setNewOrdem({ ...newOrdem, numero: e.target.value })
                }
              />
            </div>
            <DatePickerField
              date={newOrdem.dataEmissao}
              onDateChange={(date) => setNewOrdem({ ...newOrdem, dataEmissao: date })}
              label="Data de Emissão"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contrato">Contrato</Label>
            <Select
              value={newOrdem.contratoId}
              onValueChange={(value) =>
                setNewOrdem({ ...newOrdem, contratoId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um contrato" />
              </SelectTrigger>
              <SelectContent>
                {contratos
                  .filter(c => c.status === "Ativo")
                  .map((contrato) => (
                  <SelectItem key={contrato.id} value={contrato.id}>
                    {contrato.numero} - {contrato.fornecedor?.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {newOrdem.contratoId && (
            <OrdemItemsSelection
              selectedContratoId={newOrdem.contratoId}
              contratoItens={contratoItens}
              onItemsChange={(items) =>
                setNewOrdem({ ...newOrdem, itensConsumidos: items })
              }
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddOrdem}>Criar Ordem</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrdemForm;
