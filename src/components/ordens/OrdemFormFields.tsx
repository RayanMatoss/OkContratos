import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrdemFormFieldsProps {
  numero: string;
  setNumero: (value: string) => void;
  data: Date | undefined;
  setData: (date: Date | undefined) => void;
  contratoId: string;
  setContratoId: (id: string) => void;
  contratos: any[];
  loadingNumero?: boolean;
}

const OrdemFormFields = ({
  numero,
  setNumero,
  data,
  setData,
  contratoId,
  setContratoId,
  contratos,
  loadingNumero = false
}: OrdemFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="numero">Número da OF</Label>
        <Input
          id="numero"
          placeholder="Carregando número..."
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          disabled={loadingNumero}
        />
        <p className="text-xs text-muted-foreground">
          Formato: 000/AAAA (ex: 001/2025)
        </p>
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
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default OrdemFormFields;
