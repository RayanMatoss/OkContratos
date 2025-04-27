
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
            <div className="space-y-2">
              <Label>Itens do Contrato</Label>
              <div className="max-h-[200px] overflow-y-auto space-y-2 rounded-md border p-2">
                {contratos
                  .find((c) => c.id === newOrdem.contratoId)
                  ?.itens.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          Disponível: {item.quantidade - item.quantidadeConsumida} {item.unidade}
                        </p>
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          min={0}
                          max={item.quantidade - item.quantidadeConsumida}
                          placeholder="Qtd"
                          onChange={(e) => {
                            const quantidade = parseInt(e.target.value) || 0;
                            const itemIdx = newOrdem.itensConsumidos.findIndex(
                              (i) => i.itemId === item.id
                            );
                            if (itemIdx >= 0) {
                              const newItens = [...newOrdem.itensConsumidos];
                              newItens[itemIdx].quantidade = quantidade;
                              setNewOrdem({
                                ...newOrdem,
                                itensConsumidos: newItens,
                              });
                            } else {
                              setNewOrdem({
                                ...newOrdem,
                                itensConsumidos: [
                                  ...newOrdem.itensConsumidos,
                                  { itemId: item.id, quantidade },
                                ],
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
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
