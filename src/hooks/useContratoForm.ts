
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, ContratoFormValues, Item } from "@/types";

export type FormStep = 'basic' | 'dates' | 'items';

interface UseContratoFormProps {
  mode: 'create' | 'edit';
  contrato?: Contrato;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useContratoForm = ({
  mode,
  contrato,
  onSuccess,
  onOpenChange
}: UseContratoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>('basic');

  const [formData, setFormData] = useState<ContratoFormValues>({
    numero: contrato?.numero || "",
    objeto: contrato?.objeto || "",
    fornecedor_id: contrato?.fornecedorId || "",
    valor: contrato?.valor?.toString() || "",
    fundo_municipal: contrato?.fundoMunicipal || [],
    data_inicio: contrato?.dataInicio || new Date(),
    data_termino: contrato?.dataTermino || new Date(),
    items: contrato?.itens || []
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (formStep === 'basic') {
      setFormStep('dates');
    } else if (formStep === 'dates') {
      setFormStep('items');
    }
  };

  const handlePreviousStep = () => {
    if (formStep === 'dates') {
      setFormStep('basic');
    } else if (formStep === 'items') {
      setFormStep('dates');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contratoData = {
        numero: formData.numero,
        fornecedor_id: formData.fornecedor_id,
        fundo_municipal: formData.fundo_municipal,
        objeto: formData.objeto,
        valor: parseFloat(formData.valor),
        data_inicio: formData.data_inicio.toISOString(),
        data_termino: formData.data_termino.toISOString(),
      };

      if (mode === 'edit' && contrato) {
        const { error } = await supabase
          .from('contratos')
          .update(contratoData)
          .eq('id', contrato.id);

        if (error) throw error;
      } else {
        const { data: newContrato, error } = await supabase
          .from('contratos')
          .insert([contratoData])
          .select()
          .single();

        if (error) throw error;

        // Save items if any
        if (formData.items && formData.items.length > 0) {
          const itemsData = formData.items.map(item => ({
            contrato_id: newContrato.id,
            descricao: item.descricao,
            quantidade: item.quantidade,
            unidade: item.unidade || 'UN',
            valor_unitario: item.valorUnitario || 0,
            fundos: item.fundos || []
          }));

          const { error: itemsError } = await supabase
            .from('itens')
            .insert(itemsData);

          if (itemsError) throw itemsError;
        }
      }

      toast({
        title: "Sucesso",
        description: mode === 'edit' ? "Contrato atualizado com sucesso" : "Contrato criado com sucesso",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    formStep,
    loading,
    handleFieldChange,
    handleNextStep,
    handlePreviousStep,
    handleSubmit
  };
};
