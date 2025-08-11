
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from 'react-select';

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
    <>
      {/* Número da OF */}
      <div className="space-y-2">
        <Label htmlFor="numero" className="text-sm font-medium">Número da OF</Label>
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
        {mode === 'edit' && (
          <p className="text-xs text-muted-foreground">
            O contrato não pode ser alterado após a criação da ordem
          </p>
        )}
      </div>

      {/* Data de Emissão */}
      <div className="space-y-2">
        <Label htmlFor="data" className="text-sm font-medium">Data de Emissão</Label>
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
          <PopoverContent className="w-auto p-0" align="start">
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
    </>
  );
};

export default OrdemFormFields;
