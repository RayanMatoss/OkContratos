
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FundoMunicipal } from "@/types";

export const FUNDOS_MUNICIPAIS = [
  { label: "Prefeitura Municipal", value: "Prefeitura" as FundoMunicipal },
  { label: "Fundo Municipal de Educação", value: "Educação" as FundoMunicipal },
  { label: "Fundo Municipal de Saúde", value: "Saúde" as FundoMunicipal },
  { label: "Fundo Municipal de Assistência", value: "Assistência" as FundoMunicipal },
];

interface FundoMunicipalSelectorProps {
  selectedFundos: FundoMunicipal[];
  onChange: (value: FundoMunicipal[]) => void;
}

const FundoMunicipalSelector = ({ selectedFundos, onChange }: FundoMunicipalSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  // Ensure selectedFundos is always an array
  const safeSelectedFundos = Array.isArray(selectedFundos) ? selectedFundos : [];

  // Function to handle the selection and deselection of FundoMunicipal
  const handleSelectFundo = (value: FundoMunicipal) => {
    let updatedFundos: FundoMunicipal[];
    
    if (safeSelectedFundos.includes(value)) {
      // Remove the fundo if already selected
      updatedFundos = safeSelectedFundos.filter(fundo => fundo !== value);
    } else {
      // Add the fundo if not selected
      updatedFundos = [...safeSelectedFundos, value];
    }
    
    onChange(updatedFundos);
  };

  // Function to remove a fundo when clicking on badge
  const handleRemoveFundo = (value: FundoMunicipal, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the event from bubbling up
    const updatedFundos = safeSelectedFundos.filter(fundo => fundo !== value);
    onChange(updatedFundos);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button"
          >
            {safeSelectedFundos.length === 0
              ? "Selecione fundos..."
              : `${safeSelectedFundos.length} fundos selecionados`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar fundos..." />
            <CommandList>
              <CommandEmpty>Nenhum fundo encontrado.</CommandEmpty>
              <CommandGroup>
                {FUNDOS_MUNICIPAIS.map((fundo) => (
                  <CommandItem
                    key={fundo.value}
                    value={fundo.value}
                    onSelect={() => {
                      handleSelectFundo(fundo.value);
                      // Don't close the popover automatically - let user select multiple items
                    }}
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          safeSelectedFundos.includes(fundo.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {fundo.label}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="border-t p-2 flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setOpen(false)}
            >
              Concluir
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {safeSelectedFundos.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {safeSelectedFundos.map(fundo => {
            const fundoDetails = FUNDOS_MUNICIPAIS.find(f => f.value === fundo);
            return (
              <Badge 
                key={fundo} 
                variant="secondary" 
                className="mr-1 mb-1"
              >
                {fundoDetails?.label || fundo}
                <span 
                  className="ml-1 cursor-pointer" 
                  onClick={(e) => handleRemoveFundo(fundo, e)}
                >
                  ×
                </span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FundoMunicipalSelector;
