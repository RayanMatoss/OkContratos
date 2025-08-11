
<<<<<<< HEAD
<<<<<<< HEAD
import React from "react";
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
import React from "react";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
<<<<<<< HEAD
<<<<<<< HEAD
import Select from 'react-select';
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
import Select from 'react-select';
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

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
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    <>
      {/* Número da OF */}
      <div className="space-y-2">
        <Label htmlFor="numero" className="text-sm font-medium">Número da OF</Label>
<<<<<<< HEAD
=======
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="numero">Número da OF</Label>
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
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
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        {mode === 'edit' && (
          <p className="text-xs text-muted-foreground">
            O contrato não pode ser alterado após a criação da ordem
          </p>
        )}
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Data de Emissão */}
      <div className="space-y-2">
        <Label htmlFor="data" className="text-sm font-medium">Data de Emissão</Label>
=======
      <div className="space-y-2">
        <Label htmlFor="data">Data de Emissão</Label>
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
      {/* Data de Emissão */}
      <div className="space-y-2">
        <Label htmlFor="data" className="text-sm font-medium">Data de Emissão</Label>
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
          <PopoverContent className="w-auto p-0" align="start">
=======
          <PopoverContent className="w-auto p-0">
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
          <PopoverContent className="w-auto p-0" align="start">
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
    </>
=======
    </div>
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
    </>
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  );
};

export default OrdemFormFields;
