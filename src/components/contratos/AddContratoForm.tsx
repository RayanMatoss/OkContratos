
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DatePickerField from "./DatePickerField";
import ContratoBasicInfo from "./ContratoBasicInfo";

type AddContratoFormProps = {
  onClose: () => void;
  onSuccess?: () => void;
};

export const AddContratoForm = ({ onClose, onSuccess }: AddContratoFormProps) => {
  const { toast } = useToast();
  const [formStep, setFormStep] = useState<"basic" | "dates" | "items">("basic");
  const [formData, setFormData] = useState({
    numero: "",
    objeto: "",
    fornecedor_id: "",
    valor: "",
    fundo_municipal: "",
    data_inicio: new Date(),
    data_termino: new Date(),
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
    try {
      const { error } = await supabase.from("contratos").insert({
        numero: formData.numero,
        objeto: formData.objeto,
        fornecedor_id: formData.fornecedor_id,
        valor: parseFloat(formData.valor),
        fundo_municipal: formData.fundo_municipal,
        data_inicio: formData.data_inicio.toISOString(),
        data_termino: formData.data_termino.toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Contrato criado",
        description: "O contrato foi criado com sucesso.",
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formStep === "basic" && (
        <ContratoBasicInfo 
          numero={formData.numero}
          fornecedorId={formData.fornecedor_id}
          fundoMunicipal={formData.fundo_municipal as any}
          objeto={formData.objeto}
          valor={formData.valor}
          onFieldChange={(field, value) => 
            setFormData({ ...formData, [field]: value })
          }
        />
      )}

      {formStep === "dates" && (
        <div className="space-y-4">
          <DatePickerField
            label="Data de Início"
            date={formData.data_inicio}
            onDateChange={(date) =>
              setFormData({ ...formData, data_inicio: date || new Date() })
            }
          />
          <DatePickerField
            label="Data de Término"
            date={formData.data_termino}
            onDateChange={(date) =>
              setFormData({ ...formData, data_termino: date || new Date() })
            }
          />
        </div>
      )}

      {formStep === "items" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Itens do Contrato</h3>
          <p className="text-sm text-muted-foreground">
            Os itens podem ser adicionados após a criação do contrato.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        {formStep !== "basic" ? (
          <Button type="button" variant="outline" onClick={handlePreviousStep}>
            Voltar
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}

        {formStep !== "items" ? (
          <Button type="button" onClick={handleNextStep}>
            Avançar
          </Button>
        ) : (
          <Button type="submit">Salvar Contrato</Button>
        )}
      </div>
    </form>
  );
};

export default AddContratoForm;
