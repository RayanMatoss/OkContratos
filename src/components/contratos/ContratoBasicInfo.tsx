
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FundoMunicipal, Fornecedor } from "@/types";

const FUNDOS_MUNICIPAIS = [
  { label: "Prefeitura Municipal", value: "Prefeitura" as FundoMunicipal },
  { label: "Fundo Municipal de Educação", value: "Educação" as FundoMunicipal },
  { label: "Fundo Municipal de Saúde", value: "Saúde" as FundoMunicipal },
  { label: "Fundo Municipal de Assistência", value: "Assistência" as FundoMunicipal },
];

interface ContratoBasicInfoProps {
  numero: string;
  fornecedorId: string;
  fundoMunicipal: FundoMunicipal[];
  objeto: string;
  valor: string;
  fornecedores: Fornecedor[];
  onFieldChange: (field: string, value: any) => void;
}

const ContratoBasicInfo = ({
  numero,
  fornecedorId,
  fundoMunicipal = [], // Provide default empty array to prevent undefined
  objeto,
  valor,
  fornecedores,
  onFieldChange
}: ContratoBasicInfoProps) => {
  const [open, setOpen] = useState(false);

  // Ensure fundoMunicipal is always an array
  const selectedFundos = Array.isArray(fundoMunicipal) ? fundoMunicipal : [];

  const handleSelectFundo = (value: FundoMunicipal) => {
    if (selectedFundos.includes(value)) {
      // Remove the value if already selected
      onFieldChange("fundo_municipal", selectedFundos.filter(v => v !== value));
    } else {
      // Add the value if not selected
      onFieldChange("fundo_municipal", [...selectedFundos, value]);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero">Número do Contrato</Label>
          <Input
            id="numero"
            placeholder="Digite o número do contrato"
            value={numero}
            onChange={(e) => onFieldChange("numero", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fornecedor">Fornecedor</Label>
          <Select
            value={fornecedorId}
            onValueChange={(value) => onFieldChange("fornecedor_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o fornecedor" />
            </SelectTrigger>
            <SelectContent>
              {fornecedores.map((fornecedor) => (
                <SelectItem key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fundo">Fundos Municipais</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedFundos.length === 0
                  ? "Selecione fundos..."
                  : `${selectedFundos.length} fundos selecionados`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar fundos..." />
                <CommandEmpty>Nenhum fundo encontrado.</CommandEmpty>
                <CommandGroup>
                  {FUNDOS_MUNICIPAIS.map((fundo) => (
                    <CommandItem
                      key={fundo.value}
                      value={fundo.value}
                      onSelect={() => handleSelectFundo(fundo.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedFundos.includes(fundo.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {fundo.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedFundos.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedFundos.map(fundo => (
                <Badge key={fundo} variant="secondary" className="mr-1 mb-1">
                  {FUNDOS_MUNICIPAIS.find(f => f.value === fundo)?.label || fundo}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor">Valor do Contrato</Label>
          <Input
            id="valor"
            type="number"
            placeholder="Digite o valor"
            value={valor}
            onChange={(e) => onFieldChange("valor", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="objeto">Objeto do Contrato</Label>
        <Input
          id="objeto"
          placeholder="Digite o objeto do contrato"
          value={objeto}
          onChange={(e) => onFieldChange("objeto", e.target.value)}
        />
      </div>
    </div>
  );
};

export default ContratoBasicInfo;
