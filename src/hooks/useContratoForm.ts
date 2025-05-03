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

interface UseContratoFormProps {
  mode: 'create' | 'edit';
  contrato?: Contrato;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

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
        data_inicio: contrato.dataInicio || new Date(),
        data_termino: contrato.dataTermino || new Date(),
        items: contrato.itens || []
      });
    } else {
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
      // For fundo_municipal, ensure it's always an array
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
    }
  };

  const handlePreviousStep = () => {
    if (formStep === "dates") {
      setFormStep("basic");
    } else if (formStep === "items") {
      setFormStep("dates");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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

      // Ensure fundo_municipal is always an array before converting to string
      const fundoArray = Array.isArray(formData.fundo_municipal) 
        ? formData.fundo_municipal 
        : [];
      
      // Only join non-empty arrays
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
