
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, ContratoFormValues, Item } from "@/types";

export type FormStep = 'basic' | 'items';

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

  const handleFieldChange = (field: string, value: string | number | Item[] | Date | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (formStep === 'basic') {
      setFormStep('items');
    }
  };

  const handlePreviousStep = () => {
    if (formStep === 'items') {
      setFormStep('basic');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('FORM DATA ENVIADO:', formData);

    try {
      if (mode === 'edit' && contrato) {
        // Edição: atualizar contrato
        const contratoData = {
          numero: formData.numero,
          fornecedor_id: formData.fornecedor_id, // Corrigido para garantir que é string
          fundo_municipal: formData.fundo_municipal,
          objeto: formData.objeto,
          valor: parseFloat(formData.valor),
          data_inicio: formData.data_inicio.toISOString(),
          data_termino: formData.data_termino.toISOString(),
        };

        const { error } = await supabase
          .from('contratos')
          .update(contratoData)
          .eq('id', contrato.id);

        if (error) throw error;

        // Para edição, os itens são gerenciados separadamente
        // (pode ser otimizado futuramente com uma função SQL específica para edição)
      } else {
        // Criação: usar função SQL otimizada
        const { error } = await supabase.rpc('salvar_contrato_com_itens', {
          p_numero: formData.numero, // Adicionado para corresponder à função do banco
          p_fundo_municipal: Array.isArray(formData.fundo_municipal)
            ? formData.fundo_municipal
            : (formData.fundo_municipal ? [formData.fundo_municipal] : []),
          p_objeto: formData.objeto,
          p_valor: parseFloat(formData.valor),
          p_data_inicio: formData.data_inicio.toISOString().split('T')[0],
          p_data_termino: formData.data_termino.toISOString().split('T')[0],
          p_fornecedor_id: formData.fornecedor_id,
          p_itens: null
        });
        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: mode === 'edit' ? "Contrato atualizado com sucesso" : "Contrato criado com sucesso",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: unknown) {
      let message = 'Erro desconhecido';
      if (error instanceof Error) message = error.message;
      toast({
        title: "Erro",
        description: message,
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
