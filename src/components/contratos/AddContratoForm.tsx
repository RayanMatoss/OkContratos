
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Fornecedor, FundoMunicipal } from "@/types";
import FundoMunicipalSelector from "@/components/contratos/FundoMunicipalSelector";

interface AddContratoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  fornecedores: Fornecedor[];
  isEditing?: boolean;
  contratoToEdit?: any;
}

interface ContratoForm {
  numero: string;
  fundoMunicipal: FundoMunicipal[];
  objeto: string;
  valor: number;
  dataInicio: Date;
  dataTermino: Date;
}

export const AddContratoForm = ({ 
  onSuccess, 
  onCancel, 
  fornecedores,
  isEditing = false,
  contratoToEdit
}: AddContratoFormProps) => {
  const { toast } = useToast();
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null);
  const [selectedContrato, setSelectedContrato] = useState<ContratoForm>({
    numero: "",
    fundoMunicipal: [],
    objeto: "",
    valor: 0,
    dataInicio: new Date(),
    dataTermino: new Date(),
  });

  useEffect(() => {
    if (isEditing && contratoToEdit) {
      setSelectedContrato({
        numero: contratoToEdit.numero,
        fundoMunicipal: contratoToEdit.fundoMunicipal || [],
        objeto: contratoToEdit.objeto,
        valor: contratoToEdit.valor,
        dataInicio: new Date(contratoToEdit.dataInicio),
        dataTermino: new Date(contratoToEdit.dataTermino),
      });
      setSelectedFornecedor({
        id: contratoToEdit.fornecedorId,
        nome: contratoToEdit.fornecedor?.nome || '',
        cnpj: contratoToEdit.fornecedor?.cnpj || '',
        email: contratoToEdit.fornecedor?.email || '',
        telefone: contratoToEdit.fornecedor?.telefone || '',
        endereco: contratoToEdit.fornecedor?.endereco || '',
        createdAt: contratoToEdit.fornecedor?.createdAt || new Date(),
      });
    }
  }, [isEditing, contratoToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFornecedor || !selectedContrato) {
      toast({
        title: "Erro",
        description: "Selecione um fornecedor e preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convert FundoMunicipal[] to string[] for database
      const fundoMunicipalArray = selectedContrato.fundoMunicipal.map(fundo => 
        typeof fundo === 'string' ? fundo : String(fundo)
      );

      const contratoData = {
        numero: selectedContrato.numero,
        fornecedor_id: selectedFornecedor.id,
        fundo_municipal: fundoMunicipalArray,
        objeto: selectedContrato.objeto,
        valor: selectedContrato.valor,
        data_inicio: selectedContrato.dataInicio.toISOString(),
        data_termino: selectedContrato.dataTermino.toISOString(),
      };

      let contratoId;
      
      if (isEditing && contratoToEdit) {
        const { error } = await supabase
          .from('contratos')
          .update(contratoData)
          .eq('id', contratoToEdit.id);

        if (error) throw error;
        contratoId = contratoToEdit.id;
      } else {
        const { data, error } = await supabase
          .from('contratos')
          .insert([contratoData])
          .select()
          .single();

        if (error) throw error;
        contratoId = data.id;
      }

      toast({
        title: "Sucesso",
        description: "Contrato salvo com sucesso",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fornecedor">Fornecedor</Label>
        <select
          id="fornecedor"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedFornecedor?.id || ""}
          onChange={(e) => {
            const fornecedorId = e.target.value;
            const fornecedor = fornecedores.find((f) => f.id === fornecedorId);
            setSelectedFornecedor(fornecedor || null);
          }}
        >
          <option value="">Selecione um fornecedor</option>
          {fornecedores.map((fornecedor) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="numero">Número do Contrato</Label>
        <Input
          id="numero"
          placeholder="Número do contrato"
          value={selectedContrato.numero}
          onChange={(e) =>
            setSelectedContrato({ ...selectedContrato, numero: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="fundoMunicipal">Fundo Municipal</Label>
        <FundoMunicipalSelector
          selectedFundos={selectedContrato.fundoMunicipal}
          onChange={(fundos) =>
            setSelectedContrato({ ...selectedContrato, fundoMunicipal: fundos })
          }
        />
      </div>
      <div>
        <Label htmlFor="objeto">Objeto do Contrato</Label>
        <Input
          id="objeto"
          placeholder="Objeto do contrato"
          value={selectedContrato.objeto}
          onChange={(e) =>
            setSelectedContrato({ ...selectedContrato, objeto: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="valor">Valor do Contrato</Label>
        <Input
          type="number"
          id="valor"
          placeholder="Valor do contrato"
          value={selectedContrato.valor}
          onChange={(e) =>
            setSelectedContrato({
              ...selectedContrato,
              valor: parseFloat(e.target.value),
            })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Data de Início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedContrato.dataInicio
                    ? "text-muted-foreground"
                    : "text-foreground",
                )}
              >
                {selectedContrato.dataInicio ? (
                  format(selectedContrato.dataInicio, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedContrato.dataInicio}
                onSelect={(date) =>
                  setSelectedContrato({ ...selectedContrato, dataInicio: date || new Date() })
                }
                disabled={(date) =>
                  date > new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>Data de Término</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedContrato.dataTermino
                    ? "text-muted-foreground"
                    : "text-foreground",
                )}
              >
                {selectedContrato.dataTermino ? (
                  format(selectedContrato.dataTermino, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedContrato.dataTermino}
                onSelect={(date) =>
                  setSelectedContrato({ ...selectedContrato, dataTermino: date || new Date() })
                }
                disabled={(date) =>
                  date < selectedContrato.dataInicio!
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};
