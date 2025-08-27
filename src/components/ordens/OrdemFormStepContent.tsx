import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from 'react-select';
import { Item } from "@/types";
import OrdemItemsList from "./OrdemItemsList";

interface OrdemFormStepContentProps {
  contratos: any[];
  loadingContratos: boolean;
  contratoId: string;
  setContratoId: (id: string) => void;
  data: Date | undefined;
  setData: (date: Date | undefined) => void;
  numero: string;
  setNumero: (value: string) => void;
  justificativa: string;
  setJustificativa: (value: string) => void;
  selectedItems: { itemId: string; quantidade: number }[];
  contratoItems: Item[];
  mode: 'create' | 'edit';
  onAddItem?: (item: Item, quantidade: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantidade: number) => void;
}

export const OrdemFormStepContent: React.FC<OrdemFormStepContentProps> = ({
  contratos,
  loadingContratos,
  contratoId,
  setContratoId,
  data,
  setData,
  numero,
  setNumero,
  justificativa,
  setJustificativa,
  selectedItems,
  contratoItems,
  mode,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity
}) => {
  const [quantities, setQuantities] = React.useState<{ [key: string]: number }>({});

  // Inicializar quantidades quando selectedItems mudar
  React.useEffect(() => {
    const initialQuantities: { [key: string]: number } = {};
    selectedItems.forEach(item => {
      initialQuantities[item.itemId] = item.quantidade;
    });
    setQuantities(initialQuantities);
  }, [selectedItems]);

  const handleAddItem = (item: Item) => {
    if (!selectedItems.find(selected => selected.itemId === item.id)) {
      const quantidade = 1;
      setQuantities(prev => ({ ...prev, [item.id]: quantidade }));
      onAddItem?.(item, quantidade);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const newQuantities = { ...quantities };
    delete newQuantities[itemId];
    setQuantities(newQuantities);
    onRemoveItem?.(itemId);
  };

  const handleQuantityChange = (itemId: string, quantidade: number) => {
    setQuantities(prev => ({ ...prev, [itemId]: quantidade }));
    onUpdateQuantity?.(itemId, quantidade);
  };

  // Função para lidar com mudanças de quantidade usando o layout antigo
  const handleQuantityChangeFromTable = (itemId: string, quantidade: number) => {
    if (quantidade > 0) {
      // Adicionar ou atualizar item
      const existingItem = selectedItems.find(item => item.itemId === itemId);
      if (existingItem) {
        onUpdateQuantity?.(itemId, quantidade);
      } else {
        const item = contratoItems.find(i => i.id === itemId);
        if (item) {
          onAddItem?.(item, quantidade);
        }
      }
    } else {
      // Remover item se quantidade for 0
      onRemoveItem?.(itemId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Campos básicos em layout horizontal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-card border rounded-lg p-4">
        <div className="space-y-2">
          <Label htmlFor="contrato">Contrato *</Label>
          <Select
            inputId="contrato"
            classNamePrefix="select"
            className="w-full"
            isSearchable
            isClearable
            placeholder="Selecione o contrato"
            value={
              contratos
                .map((contrato) => ({
                  value: contrato.id,
                  label: `${contrato.numero} - ${contrato.objeto}`,
                }))
                .find((opt) => opt.value === contratoId) || null
            }
            onChange={(selected) => setContratoId(selected ? selected.value : '')}
            options={contratos.map((contrato) => ({
              value: contrato.id,
              label: `${contrato.numero} - ${contrato.objeto}`,
            }))}
            noOptionsMessage={() => 'Nenhum contrato encontrado'}
            isLoading={loadingContratos}
            isDisabled={loadingContratos}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data">Data</Label>
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
                {data ? format(data, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
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

        <div className="space-y-2">
          <Label htmlFor="numero">Número da Ordem</Label>
          <Input
            id="numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Será definido na aprovação"
            className="bg-gray-50"
            readOnly
          />
          <p className="text-xs text-muted-foreground">
            O número será definido pelo administrador na aprovação
          </p>
        </div>
      </div>

      {/* Justificativa */}
      <div className="space-y-2">
        <Label htmlFor="justificativa">Justificativa *</Label>
        <textarea
          id="justificativa"
          value={justificativa}
          onChange={(e) => setJustificativa(e.target.value)}
          placeholder="Descreva a necessidade desta solicitação"
          className="w-full p-3 border rounded-md min-h-[80px] resize-none"
          required
        />
      </div>

      {/* Seleção de itens usando o layout antigo com tabela */}
      {contratoId && (
        <div className="bg-card border rounded-lg p-4">
          <OrdemItemsList
            contratoItens={contratoItems}
            selectedItems={selectedItems}
            mode={mode}
            onQuantityChange={handleQuantityChangeFromTable}
          />
        </div>
      )}
    </div>
  );
};
