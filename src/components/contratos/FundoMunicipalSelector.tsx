
import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface FundoMunicipalSelectorProps {
  selectedFundos: string[];
  onChange: (fundos: string[]) => void;
}

const fundosDisponiveis = [
  "Fundo Municipal de Educação",
  "Fundo Municipal de Saúde", 
  "Fundo Municipal de Assistência Social",
  "Fundo Municipal de Obras",
  "Fundo Municipal de Meio Ambiente"
];

export default function FundoMunicipalSelector({ selectedFundos, onChange }: FundoMunicipalSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (fundo: string) => {
    const isSelected = selectedFundos.includes(fundo);
    if (isSelected) {
      onChange(selectedFundos.filter(f => f !== fundo));
    } else {
      onChange([...selectedFundos, fundo]);
    }
  };

  const handleRemove = (fundoToRemove: string) => {
    onChange(selectedFundos.filter(f => f !== fundoToRemove));
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
          >
            {selectedFundos.length > 0
              ? `${selectedFundos.length} fundos selecionados`
              : "Selecione os fundos..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar fundos..." />
            <CommandList>
              <CommandEmpty>Nenhum fundo encontrado.</CommandEmpty>
              <CommandGroup>
                {fundosDisponiveis.map((fundo) => (
                  <CommandItem
                    key={fundo}
                    value={fundo}
                    onSelect={() => handleSelect(fundo)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedFundos.includes(fundo) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {fundo}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedFundos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFundos.map((fundo) => (
            <Badge key={fundo} variant="secondary" className="text-xs">
              {fundo}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleRemove(fundo)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
