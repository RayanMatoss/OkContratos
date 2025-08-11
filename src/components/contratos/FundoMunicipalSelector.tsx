
<<<<<<< HEAD
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface FundoMunicipalSelectorProps {
  selectedFundos: string[];
  onChange: (fundos: string[]) => void;
}

const FUNDOS_FIXOS = [
  'Assistência Social',
  'Secretaria de Saúde',
  'Secretaria de Educação',
  'Prefeitura Municipal',
];

const FundoMunicipalSelector: React.FC<FundoMunicipalSelectorProps> = ({ selectedFundos, onChange }) => {
  // O Select do projeto não suporta multiselect nativamente, então vamos simular o dropdown com um popover customizado
  const [open, setOpen] = React.useState(false);

  const handleToggle = (fundo: string) => {
    if (selectedFundos.includes(fundo)) {
      onChange(selectedFundos.filter(f => f !== fundo));
    } else {
      onChange([...selectedFundos, fundo]);
    }
  };

  const displayValue =
    selectedFundos.length === 0
      ? 'Selecione os fundos/secretarias'
      : selectedFundos.join(', ');

  return (
    <div className="space-y-2">
      <Label htmlFor="fundo-municipal-selector">Fundos/Secretarias</Label>
      <div className="relative">
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={selectedFundos.length === 0 ? 'text-muted-foreground' : ''}>{displayValue}</span>
          <svg className="ml-2 h-4 w-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md p-2">
            {FUNDOS_FIXOS.map((fundo) => (
              <label key={fundo} className="flex items-center gap-2 cursor-pointer text-sm py-1 px-2 rounded hover:bg-accent">
                <Checkbox
                  checked={selectedFundos.includes(fundo)}
                  onCheckedChange={() => handleToggle(fundo)}
                />
                <span>{fundo}</span>
              </label>
          ))}
        </div>
        )}
      </div>
      {/* Fecha o dropdown ao clicar fora */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
=======
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
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
      )}
    </div>
  );
};

export default FundoMunicipalSelector;
