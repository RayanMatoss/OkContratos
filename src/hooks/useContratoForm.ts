import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, Item, FundoMunicipal } from "@/types";

interface ContratoFormValues {
  numero: string;
  objeto: string;
  fornecedor_ids: string[];
  valor: string;
  fundo_municipal: string[];
  data_inicio: Date;
  data_termino: Date;
  items: Partial<Item>[];
}
import { useAuth } from "@/hooks/useAuth";
import { formatDateForDatabase } from "@/lib/dateUtils";

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
        numero: contrato.numero || '',
        data_inicio: contrato.data_inicio || '',
        data_termino: contrato.data_termino || '',
        valor: contrato.valor || 0,
        status: contrato.status || 'Ativo',
        fornecedor_id: contrato.fornecedor_id || '',
        fundo_municipal_id: contrato.fundo_municipal_id || '',
        observacoes: contrato.observacoes || '',
        fornecedor_ids: contrato.fornecedores?.map((f: any) => f.id) || []
      });
    }
  }, [contrato]);

  const validateForm = (): boolean => {
    if (!formData.numero.trim()) {
      toast({
        title: "Erro",
        description: "Número do contrato é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.objeto.trim()) {
      toast({
        title: "Erro",
        description: "Objeto do contrato é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (formData.fornecedor_ids.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um fornecedor",
        variant: "destructive"
      });
      return false;
    }

    // Validar se todos os IDs dos fornecedores são UUIDs válidos
    for (const fornecedorId of formData.fornecedor_ids) {
      if (!fornecedorId || typeof fornecedorId !== 'string' || fornecedorId.length < 30) {
        toast({
          title: "Erro",
          description: `ID do fornecedor inválido: ${fornecedorId}`,
          variant: "destructive"
        });
        return false;
      }
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      toast({
        title: "Erro",
        description: "Valor do contrato deve ser maior que zero",
        variant: "destructive"
      });
      return false;
    }

    if (formData.fundo_municipal.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um fundo municipal",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.data_inicio || !formData.data_termino) {
      toast({
        title: "Erro",
        description: "Datas de início e término são obrigatórias",
        variant: "destructive"
      });
      return false;
    }

    if (formData.data_inicio >= formData.data_termino) {
      toast({
        title: "Erro",
        description: "Data de término deve ser posterior à data de início",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'create') {
        await createContrato();
      } else {
        await updateContrato();
      }

      toast({
        title: mode === 'create' ? "Contrato criado" : "Contrato atualizado",
        description: mode === 'create' ? "Contrato criado com sucesso!" : "Contrato atualizado com sucesso!",
        variant: "default"
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

  const createContrato = async () => {
    // Validar se o fornecedor_id é um UUID válido
    const fornecedorId = formData.fornecedor_ids[0];
    if (!fornecedorId || typeof fornecedorId !== 'string' || fornecedorId.length < 30) {
      throw new Error(`ID do fornecedor inválido: ${fornecedorId}`);
    }

    // Criar contrato
    const { data: contratoData, error: contratoError } = await supabase
      .from("contratos")
      .insert({
        numero: formData.numero,
        fornecedor_id: formData.fornecedor_ids[0], // Assumindo primeiro fornecedor
        fundo_municipal: formData.fundo_municipal,
        objeto: formData.objeto,
        valor: parseFloat(formData.valor),
        data_inicio: formatDateForDatabase(formData.data_inicio),
        data_termino: formatDateForDatabase(formData.data_termino),
        status: "Ativo"
      })
      .select()
      .single();

    if (contratoError) throw contratoError;

    // Criar itens se houver
    if (formData.items && formData.items.length > 0) {
      const itensData = formData.items.map(item => ({
        contrato_id: contratoData.id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        unidade: item.unidade || "UN",
        valor_unitario: item.valorUnitario || 0,
        quantidade_consumida: 0,
        fundos: formData.fundo_municipal
      }));

      const { error: itensError } = await supabase
        .from("itens")
        .insert(itensData);

      if (itensError) throw itensError;
    }
  };

  const updateContrato = async () => {
    if (!contrato) throw new Error("Contrato não encontrado");

    // Validar se o fornecedor_id é um UUID válido
    const fornecedorId = formData.fornecedor_ids[0];
    if (!fornecedorId || typeof fornecedorId !== 'string' || fornecedorId.length < 30) {
      throw new Error(`ID do fornecedor inválido: ${fornecedorId}`);
    }

    // Atualizar contrato
    const { error: contratoError } = await supabase
      .from("contratos")
      .update({
        numero: formData.numero,
        fornecedor_id: formData.fornecedor_ids[0],
        fundo_municipal: formData.fundo_municipal,
        objeto: formData.objeto,
        valor: parseFloat(formData.valor),
        data_inicio: formatDateForDatabase(formData.data_inicio),
        data_termino: formatDateForDatabase(formData.data_termino)
      })
      .eq("id", contrato.id);

    if (contratoError) throw contratoError;

    // Atualizar itens se houver
    if (formData.items && formData.items.length > 0) {
      // Primeiro deletar itens existentes
      const { error: deleteError } = await supabase
        .from("itens")
        .delete()
        .eq("contrato_id", contrato.id);

      if (deleteError) throw deleteError;

      // Depois inserir novos itens
      const itensData = formData.items.map(item => ({
        contrato_id: contrato.id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        unidade: item.unidade || "UN",
        valor_unitario: item.valorUnitario || 0,
        quantidade_consumida: 0,
        fundos: formData.fundo_municipal
      }));

      const { error: itensError } = await supabase
        .from("itens")
        .insert(itensData);

      if (itensError) throw itensError;
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        descricao: "",
        quantidade: 1,
        unidade: "UN",
        valorUnitario: 0
      }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof Item, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const nextStep = () => {
    if (formStep === 'basic') {
      setFormStep('items');
    }
  };

  const prevStep = () => {
    if (formStep === 'items') {
      setFormStep('basic');
    }
  };

  return {
    formData,
    setFormData,
    formStep,
    loading,
    handleFieldChange,
    handleSubmit,
    addItem,
    removeItem,
    updateItem,
    nextStep,
    prevStep
  };
};
