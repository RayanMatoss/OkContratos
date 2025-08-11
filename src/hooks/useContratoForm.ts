
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, ContratoFormValues, Item } from "@/types";
import { useAuth } from "@/hooks/useAuth";

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
  const { fundosSelecionados } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>('basic');

  const [formData, setFormData] = useState<ContratoFormValues>({
    numero: contrato?.numero || "",
    objeto: contrato?.objeto || "",
    fornecedor_ids: contrato?.fornecedorIds || [],
    valor: contrato?.valor?.toString() || "",
    fundo_municipal: contrato?.fundoMunicipal || fundosSelecionados || [],
    data_inicio: contrato?.dataInicio || new Date(),
    data_termino: contrato?.dataTermino || new Date(),
    items: contrato?.itens || []
  });

  // Atualizar formData quando o contrato ou fundosSelecionados mudar
  useEffect(() => {
    if (contrato) {
      setFormData({
        numero: contrato.numero || "",
        objeto: contrato.objeto || "",
        fornecedor_ids: contrato.fornecedorIds || [],
        valor: contrato.valor?.toString() || "",
        fundo_municipal: contrato.fundoMunicipal || fundosSelecionados || [],
        data_inicio: contrato.dataInicio || new Date(),
        data_termino: contrato.dataTermino || new Date(),
        items: contrato.itens || []
      });
    } else {
      // Para novos contratos, usar os fundos selecionados no login
      setFormData(prev => ({
        ...prev,
        fundo_municipal: fundosSelecionados || []
      }));
    }
  }, [contrato, fundosSelecionados]);

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

    try {
      // Garantir que fornecedor_id seja uma string válida
      const fornecedorId = Array.isArray(formData.fornecedor_ids) && formData.fornecedor_ids.length > 0
        ? formData.fornecedor_ids[0]
        : (typeof formData.fornecedor_ids === 'string' ? formData.fornecedor_ids : '');

      if (!fornecedorId) {
        throw new Error('É necessário selecionar um fornecedor');
      }

      if (mode === 'edit' && contrato) {
        // Edição: atualizar contrato
        const contratoData = {
          numero: formData.numero,
          fundo_municipal: Array.isArray(formData.fundo_municipal)
            ? formData.fundo_municipal
            : (formData.fundo_municipal ? [formData.fundo_municipal] : []),
          objeto: formData.objeto,
          valor: parseFloat(formData.valor),
          data_inicio: formData.data_inicio.toISOString(),
          data_termino: formData.data_termino.toISOString(),
          fornecedor_id: fornecedorId
        };

        const { error: contratoError } = await supabase
          .from('contratos')
          .update(contratoData)
          .eq('id', contrato.id);

        if (contratoError) throw contratoError;
      } else {
        // Criação: criar contrato único
        const contratoData = {
          numero: formData.numero,
          fundo_municipal: Array.isArray(formData.fundo_municipal)
            ? formData.fundo_municipal
            : (formData.fundo_municipal ? [formData.fundo_municipal] : []),
          objeto: formData.objeto,
          valor: parseFloat(formData.valor),
          data_inicio: formData.data_inicio.toISOString().split('T')[0],
          data_termino: formData.data_termino.toISOString().split('T')[0],
          fornecedor_id: fornecedorId
        };

        const { data: newContrato, error: contratoError } = await supabase
          .from('contratos')
          .insert([contratoData])
          .select()
          .single();

        if (contratoError) throw contratoError;
      }

      // Mostrar mensagem de sucesso
      if (mode === 'edit') {
        toast({
          title: "Sucesso",
          description: "Contrato atualizado com sucesso",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Contrato criado com sucesso",
        });
      }

      // Fechar modal e recarregar dados
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar contrato",
        variant: "destructive",
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
