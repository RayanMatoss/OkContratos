
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OrdemItemsSelection from "./OrdemItemsSelection";
import { Item } from "@/types";

type AddOrdemFormProps = {
  onSuccess?: () => void;
  onCancel: () => void;
};

export const AddOrdemForm = ({ onSuccess, onCancel }: AddOrdemFormProps) => {
  const { toast } = useToast();
  const [data, setData] = useState<Date | undefined>(new Date());
  const [numero, setNumero] = useState("");
  const [contratos, setContratos] = useState<any[]>([]);
  const [contratoItems, setContratoItems] = useState<Item[]>([]);
  const [contratoId, setContratoId] = useState("");
  const [selectedItems, setSelectedItems] = useState<{itemId: string; quantidade: number}[]>([]);

  useEffect(() => {
    fetchContratos();
  }, []);

  useEffect(() => {
    if (contratoId) {
      fetchContratoItems();
    } else {
      setContratoItems([]);
    }
  }, [contratoId]);

  const fetchContratos = async () => {
    const { data, error } = await supabase
      .from("contratos")
      .select("id, numero, objeto, fornecedor_id, fornecedores(nome)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar contratos",
        variant: "destructive",
      });
      return;
    }

    setContratos(data || []);
  };

  const fetchContratoItems = async () => {
    const { data, error } = await supabase
      .from("itens")
      .select("*")
      .eq("contrato_id", contratoId);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar itens do contrato",
        variant: "destructive",
      });
      return;
    }

    setContratoItems(data as Item[] || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contratoId || !data || !numero) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: ordemData, error: ordemError } = await supabase
        .from("ordens")
        .insert({
          contrato_id: contratoId,
          data_emissao: data.toISOString(),
          numero,
        })
        .select("id")
        .single();

      if (ordemError) throw ordemError;

      if (selectedItems.length > 0) {
        const itensConsumidos = selectedItems.map(item => ({
          ordem_id: ordemData.id,
          item_id: item.itemId,
          quantidade: item.quantidade
        }));

        const { error: itensError } = await supabase
          .from("itens_consumidos")
          .insert(itensConsumidos);

        if (itensError) throw itensError;
      }

      toast({
        title: "Ordem de Fornecimento criada",
        description: "A ordem foi criada com sucesso",
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="numero">Número da OF</Label>
          <Input
            id="numero"
            placeholder="Digite o número da ordem"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contrato">Contrato</Label>
          <select
            id="contrato"
            value={contratoId}
            onChange={(e) => setContratoId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Selecione um contrato</option>
            {contratos.map((contrato) => (
              <option key={contrato.id} value={contrato.id}>
                {contrato.numero} - {contrato.objeto} ({contrato.fornecedores?.nome})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data">Data de Emissão</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data ? format(data, "dd/MM/yyyy") : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data}
                onSelect={setData}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {contratoId && (
          <OrdemItemsSelection
            selectedContratoId={contratoId}
            contratoItens={contratoItems}
            onItemsChange={setSelectedItems}
          />
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Criar Ordem</Button>
      </div>
    </form>
  );
};

export default AddOrdemForm;
