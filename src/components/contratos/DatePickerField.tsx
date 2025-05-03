<<<<<<< HEAD
=======

>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label: string;
}

const DatePickerField = ({ date, onDateChange, label }: DatePickerFieldProps) => {
  return (
<<<<<<< HEAD
    <div className="flex flex-col mb-4">
      <label className="text-xs mb-2">{label}</label>
=======
    <div className="space-y-2">
      <label>{label}</label>
>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
<<<<<<< HEAD
              "w-full border rounded px-4 py-2 bg-background text-foreground text-left font-normal",
=======
              "w-full justify-start text-left font-normal",
>>>>>>> e0ca1c6fde1a16023c05f05bc8be66564ad61935
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
    </div>
  );
};

export default DatePickerField;
