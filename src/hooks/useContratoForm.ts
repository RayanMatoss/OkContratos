
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
    data_termino: new Date()
  });

  useEffect(() => {
    if (mode === 'edit' && contrato) {
      // Parse fundo_municipal to always ensure it's an array
      let fundoArray: FundoMunicipal[] = [];
      
      if (Array.isArray(contrato.fundoMunicipal)) {
        fundoArray = [...contrato.fundoMunicipal];
      } else if (typeof contrato.fundoMunicipal === 'string') {
        // Convert comma-separated string to an array
        const fundoString = contrato.fundoMunicipal as string;
        fundoArray = fundoString.split(', ')
          .filter(Boolean)
          .map(item => item.trim() as FundoMunicipal);
      }
      
      setFormData({
        numero: contrato.numero || "",
        objeto: contrato.objeto || "",
        fornecedor_id: contrato.fornecedorId || "",
        valor: contrato.valor?.toString() || "",
        fundo_municipal: fundoArray,
        data_inicio: contrato.dataInicio || new Date(),
        data_termino: contrato.dataTermino || new Date()
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
        data_termino: new Date()
      });
    }
    
    // Always reset to the first step when opening the modal
    setFormStep("basic");
  }, [mode, contrato]);

  const handleFieldChange = (field: keyof ContratoFormData, value: any) => {
    setFormData(prev => {
      // For fundo_municipal, ensure it's always an array
      if (field === "fundo_municipal") {
        if (value === undefined || value === null) {
          value = [];
        } else if (!Array.isArray(value)) {
          // If somehow a non-array value is passed, convert it
          value = [value];
        }
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

      if (mode === 'create') {
        const response = await supabase.from("contratos").insert([data]);
        error = response.error;
      } else if (mode === 'edit' && contrato) {
        const response = await supabase
          .from("contratos")
          .update(data)
          .eq('id', contrato.id)
          .eq('status', 'Em Aprovação');
        error = response.error;
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
