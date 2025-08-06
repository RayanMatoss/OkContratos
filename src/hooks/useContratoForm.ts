
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
    fornecedor_ids: contrato?.fornecedorIds || [],
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
          fundo_municipal: formData.fundo_municipal,
          objeto: formData.objeto,
          valor: parseFloat(formData.valor),
          data_inicio: formData.data_inicio.toISOString(),
          data_termino: formData.data_termino.toISOString(),
        };

        const { error: contratoError } = await supabase
          .from('contratos')
          .update(contratoData)
          .eq('id', contrato.id);

        if (contratoError) throw contratoError;

        // Atualizar fornecedores do contrato
        if (Array.isArray(formData.fornecedor_ids)) {
          // Remover todos os fornecedores existentes
          const { error: deleteError } = await supabase
            .from('contrato_fornecedores')
            .delete()
            .eq('contrato_id', contrato.id);

          if (deleteError) throw deleteError;

          // Adicionar os novos fornecedores
          if (formData.fornecedor_ids.length > 0) {
            const fornecedoresToInsert = formData.fornecedor_ids.map(fornecedorId => ({
              contrato_id: contrato.id,
              fornecedor_id: fornecedorId
            }));

            const { error: insertError } = await supabase
              .from('contrato_fornecedores')
              .insert(fornecedoresToInsert);

            if (insertError) throw insertError;
          }
        }
      } else {
        // Criação: criar contrato primeiro
        const { data: contratoData, error: contratoError } = await supabase
          .from('contratos')
          .insert({
            numero: formData.numero,
            fundo_municipal: Array.isArray(formData.fundo_municipal)
              ? formData.fundo_municipal
              : (formData.fundo_municipal ? [formData.fundo_municipal] : []),
            objeto: formData.objeto,
            valor: parseFloat(formData.valor),
            data_inicio: formData.data_inicio.toISOString().split('T')[0],
            data_termino: formData.data_termino.toISOString().split('T')[0],
          })
          .select()
          .single();

        if (contratoError) throw contratoError;

        // Adicionar fornecedores ao contrato
        if (contratoData && Array.isArray(formData.fornecedor_ids) && formData.fornecedor_ids.length > 0) {
          const fornecedoresToInsert = formData.fornecedor_ids.map(fornecedorId => ({
            contrato_id: contratoData.id,
            fornecedor_id: fornecedorId
          }));

          const { error: fornecedoresError } = await supabase
            .from('contrato_fornecedores')
            .insert(fornecedoresToInsert);

          if (fornecedoresError) throw fornecedoresError;
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
