
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PeriodoSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const PeriodoSelector = ({ value, onValueChange }: PeriodoSelectorProps) => {
  return (
    <div className="w-48">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3">Últimos 3 meses</SelectItem>
          <SelectItem value="6">Últimos 6 meses</SelectItem>
          <SelectItem value="12">Último ano</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
