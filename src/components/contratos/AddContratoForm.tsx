
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormSheet } from "@/components/ui/form-sheet";
import ContratoBasicInfo from "./ContratoBasicInfo";
import ContratoDates from "./ContratoDates";
import ContratoItems from "./ContratoItems";
import { useFornecedores } from "@/hooks/useFornecedores";

type AddContratoFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export const AddContratoForm = ({
  open,
  onOpenChange,
  onSuccess
}: AddContratoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState<"basic" | "dates" | "items">("basic");
  const { fornecedores } = useFornecedores(open);
  const [formData, setFormData] = useState({
    numero: "",
    objeto: "",
    fornecedor_id: "",
    valor: "",
    fundo_municipal: "",
    data_inicio: new Date(),
    data_termino: new Date()
  });

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
      const { error } = await supabase.from("contratos").insert({
        numero: formData.numero,
        objeto: formData.objeto,
        fornecedor_id: formData.fornecedor_id,
        valor: parseFloat(formData.valor),
        fundo_municipal: formData.fundo_municipal,
        data_inicio: formData.data_inicio.toISOString(),
        data_termino: formData.data_termino.toISOString()
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Contrato criado com sucesso."
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

  const renderStepContent = () => {
    switch (formStep) {
      case "basic":
        return (
          <ContratoBasicInfo 
            numero={formData.numero}
            fornecedorId={formData.fornecedor_id}
            fundoMunicipal={formData.fundo_municipal as any}
            objeto={formData.objeto}
            valor={formData.valor}
            fornecedores={fornecedores}
            onFieldChange={(field, value) => setFormData({
              ...formData,
              [field]: value
            })}
          />
        );
      case "dates":
        return (
          <ContratoDates
            dataInicio={formData.data_inicio}
            dataTermino={formData.data_termino}
            onDateChange={(field, date) => setFormData({
              ...formData,
              [field]: date
            })}
          />
        );
      case "items":
        return <ContratoItems />;
      default:
        return null;
    }
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      title="Novo Contrato"
      description="Preencha os dados do novo contrato"
      loading={loading}
    >
      {renderStepContent()}
    </FormSheet>
  );
};

export default AddContratoForm;
