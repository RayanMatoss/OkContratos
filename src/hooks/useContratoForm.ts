<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, ContratoFormValues, Item, FundoMunicipal } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { formatDateForDatabase } from "@/lib/dateUtils";

export type FormStep = 'basic' | 'items';
<<<<<<< HEAD
=======
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, FundoMunicipal } from "@/types";

export type FormStep = "basic" | "dates" | "items";

interface ContratoFormData {
  numero: string;
  objeto: string;
  fornecedor_id: string;
  valor: string;
  fundo_municipal: FundoMunicipal[];
  data_inicio: Date;
  data_termino: Date;
  items?: { descricao: string; quantidade: number }[];
}
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

interface UseContratoFormProps {
  mode: 'create' | 'edit';
  contrato?: Contrato;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
=======
export const useContratoForm = ({ mode, contrato, onSuccess, onOpenChange }: UseContratoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>("basic");
  
  const [formData, setFormData] = useState<ContratoFormData>({
    numero: "",
    objeto: "",
    fornecedor_id: "",
    valor: "",
    fundo_municipal: [],
    data_inicio: new Date(),
    data_termino: new Date(),
    items: []
  });

  // Helper function to parse fundo_municipal from various formats to FundoMunicipal[]
  const parseFundoMunicipal = (value: unknown): FundoMunicipal[] => {
    // Handle array case
    if (Array.isArray(value)) {
      return value as FundoMunicipal[];
    }
    
    // Handle string case: "Educação, Saúde" -> ["Educação", "Saúde"]
    if (typeof value === 'string' && value.trim() !== '') {
      return value.split(', ')
        .map(item => item.trim() as FundoMunicipal)
        .filter(Boolean);
    }
    
    // Default: return empty array
    return [];
  };

  useEffect(() => {
    if (mode === 'edit' && contrato) {
      setFormData({
        numero: contrato.numero || "",
        objeto: contrato.objeto || "",
        fornecedor_id: contrato.fornecedorId || "",
        valor: contrato.valor?.toString() || "",
        fundo_municipal: parseFundoMunicipal(contrato.fundoMunicipal),
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        data_inicio: contrato.dataInicio || new Date(),
        data_termino: contrato.dataTermino || new Date(),
        items: contrato.itens || []
      });
    } else {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
=======
      // Reset the form for creation mode
      setFormData({
        numero: "",
        objeto: "",
        fornecedor_id: "",
        valor: "",
        fundo_municipal: [],
        data_inicio: new Date(),
        data_termino: new Date(),
        items: []
      });
    }
    
    // Always reset to the first step when opening the modal
    setFormStep("basic");
  }, [mode, contrato]);

  const handleFieldChange = (field: keyof ContratoFormData, value: any) => {
    setFormData(prev => {
      if (field === "fundo_municipal") {
        return {
          ...prev,
          [field]: Array.isArray(value) ? value : []
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleNextStep = () => {
    if (formStep === "basic") {
      setFormStep("dates");
    } else if (formStep === "dates") {
      setFormStep("items");
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    }
  };

  const handlePreviousStep = () => {
<<<<<<< HEAD
<<<<<<< HEAD
    if (formStep === 'items') {
      setFormStep('basic');
=======
    if (formStep === "dates") {
      setFormStep("basic");
    } else if (formStep === "items") {
      setFormStep("dates");
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
    if (formStep === 'items') {
      setFormStep('basic');
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

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
          data_inicio: formatDateForDatabase(formData.data_inicio),
          data_termino: formatDateForDatabase(formData.data_termino),
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
          data_inicio: formatDateForDatabase(formData.data_inicio),
          data_termino: formatDateForDatabase(formData.data_termino),
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
<<<<<<< HEAD
=======
    try {
      // Exigir pelo menos um item antes de criar o contrato
      if (!formData.items || formData.items.length === 0) {
        toast({
          title: "Adicione pelo menos um item",
          description: "Inclua ao menos um item ao contrato antes de salvar.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const fundoArray = Array.isArray(formData.fundo_municipal) 
        ? formData.fundo_municipal 
        : [];
      const formattedFundos = fundoArray.length > 0 ? fundoArray.join(', ') : '';
      const data = {
        numero: formData.numero,
        objeto: formData.objeto,
        fornecedor_id: formData.fornecedor_id,
        valor: parseFloat(formData.valor) || 0,
        fundo_municipal: formattedFundos, 
        data_inicio: formData.data_inicio instanceof Date ? formData.data_inicio.toISOString() : new Date().toISOString(),
        data_termino: formData.data_termino instanceof Date ? formData.data_termino.toISOString() : new Date().toISOString()
      };
      let error;
      let contratoId;
      if (mode === 'create') {
        const response = await supabase.from("contratos").insert([data]).select('id').single();
        error = response.error;
        contratoId = response.data?.id;
        // Inserir itens se houver
        if (!error && contratoId && formData.items && formData.items.length > 0) {
          const itensToInsert = formData.items.map(item => ({
            ...item,
            contrato_id: contratoId,
            unidade: "un", // valor padrão
            valor_unitario: 0 // valor padrão
          }));
          const itensResponse = await supabase.from("itens").insert(itensToInsert);
          if (itensResponse.error) {
            // Remover o contrato criado se falhar a inserção dos itens
            await supabase.from("contratos").delete().eq("id", contratoId);
            throw itensResponse.error;
          }
        }
      } else if (mode === 'edit' && contrato) {
        const response = await supabase
          .from("contratos")
          .update(data)
          .eq('id', contrato.id)
          .eq('status', 'Em Aprovação');
        error = response.error;
        // Atualização de itens pode ser implementada aqui se necessário
      }
      if (error) throw error;
      toast({
        title: mode === 'create' ? "Contrato criado" : "Contrato atualizado",
        description: mode === 'create' ? "Contrato criado com sucesso." : "Contrato atualizado com sucesso."
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
