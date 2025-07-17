
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
      if (mode === 'edit' && contrato) {
        // Edição: atualizar contrato
        const contratoData = {
          numero: formData.numero,
          fornecedor_id: Array.isArray(formData.fornecedor_id) ? formData.fornecedor_id : [formData.fornecedor_id],
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
        try {
          const response = await fetch(`${supabase.supabaseUrl}/rest/v1/rpc/salvar_contrato_com_itens`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabase.supabaseKey}`,
              'apikey': supabase.supabaseKey
            },
            body: JSON.stringify({
              p_numero: formData.numero,
              p_fornecedor_id: Array.isArray(formData.fornecedor_id) ? formData.fornecedor_id : [formData.fornecedor_id],
              p_fundo_municipal: formData.fundo_municipal,
              p_objeto: formData.objeto,
              p_valor: parseFloat(formData.valor),
              p_data_inicio: formData.data_inicio.toISOString().split('T')[0],
              p_data_termino: formData.data_termino.toISOString().split('T')[0],
              p_itens: formData.items && formData.items.length > 0 
                ? formData.items.map(item => ({
                    descricao: item.descricao,
                    quantidade: item.quantidade,
                    unidade: item.unidade || 'UN',
                    valor_unitario: item.valorUnitario || 0,
                    fundos: item.fundos || []
                  }))
                : null
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao salvar contrato');
          }
        } catch (error: any) {
          throw error;
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
