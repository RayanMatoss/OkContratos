import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
<<<<<<< HEAD
<<<<<<< HEAD
import { useState } from "react";
import { parse, isValid } from "date-fns";
import React from "react";
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
import { useState } from "react";
import { parse, isValid } from "date-fns";
import React from "react";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

interface DatePickerFieldProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label: string;
}

const DatePickerField = ({ date, onDateChange, label }: DatePickerFieldProps) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  const [inputValue, setInputValue] = useState(date ? format(date, "dd/MM/yyyy") : "");
  const [open, setOpen] = useState(false);

  // Atualiza o input quando a data muda externamente
  React.useEffect(() => {
    setInputValue(date ? format(date, "dd/MM/yyyy") : "");
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const parsed = parse(value, "dd/MM/yyyy", new Date());
    if (isValid(parsed)) {
      onDateChange(parsed);
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setInputValue(format(selectedDate, "dd/MM/yyyy"));
      onDateChange(selectedDate);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <label>{label}</label>
      <div className="relative flex items-center">
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10"
          placeholder="dd/MM/yyyy"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          tabIndex={-1}
          onClick={() => setOpen((v) => !v)}
        >
          <CalendarIcon className="h-4 w-4" />
        </button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarSelect}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
<<<<<<< HEAD
=======
  return (
    <div className="flex flex-col mb-4">
      <label className="text-xs mb-2">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full border rounded px-4 py-2 bg-background text-foreground text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    </div>
  );
};

export default DatePickerField;
