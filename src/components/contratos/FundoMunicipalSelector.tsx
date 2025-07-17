
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
      )}
    </div>
  );
};

export default FundoMunicipalSelector;
