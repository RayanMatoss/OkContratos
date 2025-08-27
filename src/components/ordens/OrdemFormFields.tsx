import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
  loadingContratos?: boolean;
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
  loadingContratos = false,
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
          placeholder={loadingContratos ? "Carregando contratos..." : "Selecione um contrato para continuar"}
          value={contratos.find(c => c.id === contratoId) ? { 
            value: contratoId, 
            label: `${contratos.find(c => c.id === contratoId)?.numero || 'N/A'} - ${contratos.find(c => c.id === contratoId)?.fornecedores?.[0]?.nome || 'Sem fornecedor'}${contratos.find(c => c.id === contratoId)?.status ? ` (${contratos.find(c => c.id === contratoId)?.status})` : ''}`
          } : null}
          onChange={(option) => setContratoId(option?.value || '')}
          options={contratos.map(contrato => ({
            value: contrato.id,
            label: `${contrato.numero || 'N/A'} - ${contrato.fornecedores?.[0]?.nome || 'Sem fornecedor'}${contrato.status ? ` (${contrato.status})` : ''}`
          }))}
          noOptionsMessage={() => loadingContratos ? "Carregando..." : "Nenhum contrato disponível"}
          isDisabled={mode === 'edit' || loadingContratos}
          isLoading={loadingContratos}
          theme={theme => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: '#dbeafe',
              primary: '#2563eb',
              neutral0: '#ffffff',
              neutral80: '#1f2937',
              neutral20: '#d1d5db',
              neutral30: '#2563eb',
              neutral10: '#f3f4f6',
              neutral5: '#f9fafb',
              danger: '#ef4444',
              dangerLight: '#fef2f2',
            }
          })}
                      styles={{
              control: (base) => ({ 
                ...base, 
                minHeight: 40, 
                height: 40, 
                borderRadius: 6, 
                borderColor: '#d1d5db', 
                backgroundColor: '#ffffff', 
                color: '#1f2937', 
                boxShadow: 'none', 
                paddingLeft: 8, 
                paddingRight: 8 
              }),
              valueContainer: (base) => ({ 
                ...base, 
                minHeight: 40, 
                height: 40, 
                padding: '0 8px' 
              }),
              input: (base) => ({ 
                ...base, 
                margin: 0, 
                padding: 0, 
                color: '#1f2937' 
              }),
              indicatorsContainer: (base) => ({ 
                ...base, 
                height: 40 
              }),
              option: (base, state) => ({ 
                ...base, 
                minHeight: 40, 
                height: 40, 
                backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#dbeafe' : '#ffffff', 
                color: state.isSelected ? '#ffffff' : '#1f2937', 
                fontSize: 14 
              }),
              menu: (base) => ({ 
                ...base, 
                backgroundColor: '#ffffff', 
                color: '#1f2937', 
                borderRadius: 6, 
                marginTop: 2 
              }),
              singleValue: (base) => ({ 
                ...base, 
                color: '#1f2937' 
              }),
              placeholder: (base) => ({ 
                ...base, 
                color: '#6b7280' 
              })
            }}
        />
                 {mode === 'create' && (
           <p className="text-xs text-muted-foreground">
             Selecione um contrato para ver os itens disponíveis
           </p>
         )}
         {mode === 'edit' && (
           <p className="text-xs text-muted-foreground">
             O contrato não pode ser alterado após a criação
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
              {data ? format(data, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={data}
              onSelect={setData}
              initialFocus
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground">
          Selecione a data de emissão da ordem
        </p>
      </div>
    </>
  );
};

export default OrdemFormFields;
