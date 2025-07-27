import DatePickerField from "./DatePickerField";
import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ContratoDatesProps {
  dataInicio: Date;
  dataTermino: Date;
  onDateChange: (field: "data_inicio" | "data_termino", date: Date) => void;
}

const ContratoDates = ({ dataInicio, dataTermino, onDateChange }: ContratoDatesProps) => {
  // Estado local para o input de intervalo
  const [inputValue, setInputValue] = useState(() => {
    const ini = dataInicio ? format(dataInicio, "dd/MM/yyyy") : "";
    const fim = dataTermino ? format(dataTermino, "dd/MM/yyyy") : "";
    return ini && fim ? `${ini} - ${fim}` : "";
  });
  const [open, setOpen] = useState(false);

  // Atualiza o input quando as datas mudam externamente
  React.useEffect(() => {
    const ini = dataInicio ? format(dataInicio, "dd/MM/yyyy") : "";
    const fim = dataTermino ? format(dataTermino, "dd/MM/yyyy") : "";
    setInputValue(ini && fim ? `${ini} - ${fim}` : "");
  }, [dataInicio, dataTermino]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const [ini, fim] = value.split("-").map(v => v.trim());
    const parsedIni = parse(ini, "dd/MM/yyyy", new Date());
    const parsedFim = parse(fim, "dd/MM/yyyy", new Date());
    if (isValid(parsedIni) && isValid(parsedFim)) {
      onDateChange("data_inicio", parsedIni);
      onDateChange("data_termino", parsedFim);
    }
  };

  const handleCalendarRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && isValid(range.from)) {
      onDateChange("data_inicio", range.from);
    }
    if (range?.to && isValid(range.to)) {
      onDateChange("data_termino", range.to);
    }
    if (range?.from && range?.to) {
      setInputValue(`${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <label>Período do Contrato</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10"
              placeholder="dd/MM/yyyy - dd/MM/yyyy"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={e => {
                const value = e.target.value;
                const [ini, fim] = value.split("-").map(v => v.trim());
                const parsedIni = parse(ini, "dd/MM/yyyy", new Date());
                const parsedFim = parse(fim, "dd/MM/yyyy", new Date());
                if (isValid(parsedIni) && isValid(parsedFim)) {
                  onDateChange("data_inicio", parsedIni);
                  onDateChange("data_termino", parsedFim);
                }
              }}
              readOnly={false}
            />
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from: dataInicio, to: dataTermino }}
            onSelect={handleCalendarRangeSelect}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ContratoDates;
