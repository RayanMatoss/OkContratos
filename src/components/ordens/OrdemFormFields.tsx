
<<<<<<< HEAD
import React from "react";
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
<<<<<<< HEAD
import Select from 'react-select';
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654

interface OrdemFormFieldsProps {
  numero: string;
  setNumero: (value: string) => void;
  data: Date | undefined;
  setData: (date: Date | undefined) => void;
  contratoId: string;
  setContratoId: (id: string) => void;
  contratos: any[];
  loadingNumero?: boolean;
  mode?: 'create' | 'edit';
}

const OrdemFormFields = ({
  numero,
  setNumero,
  data,
  setData,
  contratoId,
  setContratoId,
  contratos,
  loadingNumero = false,
  mode = 'create'
}: OrdemFormFieldsProps) => {
  return (
<<<<<<< HEAD
    <>
      {/* Número da OF */}
      <div className="space-y-2">
        <Label htmlFor="numero" className="text-sm font-medium">Número da OF</Label>
=======
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="numero">Número da OF</Label>
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
        <Input
          id="numero"
          placeholder="Carregando número..."
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          disabled={loadingNumero || mode === 'edit'}
          className={mode === 'edit' ? "bg-muted" : ""}
        />
        {mode === 'create' && (
          <p className="text-xs text-muted-foreground">
            Formato: 000/AAAA (ex: 001/2025)
          </p>
        )}
        {mode === 'edit' && (
          <p className="text-xs text-muted-foreground">
            O número da ordem não pode ser alterado após a criação
          </p>
        )}
      </div>

<<<<<<< HEAD
      {/* Contrato */}
      <div className="space-y-2">
        <Label htmlFor="contrato" className="text-sm font-medium">Contrato</Label>
        <Select
          inputId="contrato"
          classNamePrefix="select"
          className="w-full"
          isSearchable
          isClearable
          placeholder="Selecione um contrato"
          value={
            contratos
              .map((contrato) => ({
                value: contrato.id,
                label: `${contrato.numero} - ${contrato.objeto} (${contrato.fornecedores?.nome || contrato.fornecedor?.nome || ''})`,
              }))
              .find((opt) => opt.value === contratoId) || null
          }
          onChange={(selected) => setContratoId(selected ? selected.value : '')}
          options={contratos.map((contrato) => ({
            value: contrato.id,
            label: `${contrato.numero} - ${contrato.objeto} (${contrato.fornecedores?.nome || contrato.fornecedor?.nome || ''})`,
          }))}
          noOptionsMessage={() => 'Nenhum contrato encontrado'}
          styles={{
            option: (provided) => ({
              ...provided,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
          }}
          isDisabled={mode === 'edit'}
        />
=======
      <div className="space-y-2">
        <Label htmlFor="contrato">Contrato</Label>
        <select
          id="contrato"
          value={contratoId}
          onChange={(e) => setContratoId(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          disabled={mode === 'edit'} // Only disable in edit mode
        >
          <option value="">Selecione um contrato</option>
          {contratos.map((contrato) => (
            <option key={contrato.id} value={contrato.id}>
              {contrato.numero} - {contrato.objeto} ({contrato.fornecedores?.nome})
            </option>
          ))}
        </select>
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
        {mode === 'edit' && (
          <p className="text-xs text-muted-foreground">
            O contrato não pode ser alterado após a criação da ordem
          </p>
        )}
      </div>

<<<<<<< HEAD
      {/* Data de Emissão */}
      <div className="space-y-2">
        <Label htmlFor="data" className="text-sm font-medium">Data de Emissão</Label>
=======
      <div className="space-y-2">
        <Label htmlFor="data">Data de Emissão</Label>
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !data && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data ? format(data, "dd/MM/yyyy") : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
<<<<<<< HEAD
          <PopoverContent className="w-auto p-0" align="start">
=======
          <PopoverContent className="w-auto p-0">
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
            <Calendar
              mode="single"
              selected={data}
              onSelect={setData}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
<<<<<<< HEAD
    </>
=======
    </div>
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
  );
};

export default OrdemFormFields;
