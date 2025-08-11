import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { parse, isValid } from "date-fns";
import React from "react";

interface DatePickerFieldProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label: string;
}

const DatePickerField = ({ date, onDateChange, label }: DatePickerFieldProps) => {
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
    </div>
  );
};

export default DatePickerField;
