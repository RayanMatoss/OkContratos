
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormSheet } from "@/components/ui/form-sheet";
import ContratoBasicInfo from "./ContratoBasicInfo";
import ContratoDates from "./ContratoDates";
import ContratoItems from "./ContratoItems";
import { useFornecedores } from "@/hooks/useFornecedores";
import { Button } from "@/components/ui/button";
import { Contrato, FundoMunicipal } from "@/types";

type ContratoFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode: 'create' | 'edit';
  contrato?: Contrato;
};

export const ContratoFormDialog = ({
  open,
  onOpenChange,
  onSuccess,
  mode,
  contrato
}: ContratoFormDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState<"basic" | "dates" | "items">("basic");
  const { fornecedores } = useFornecedores(open);
  const [formData, setFormData] = useState({
    numero: "",
    objeto: "",
    fornecedor_id: "",
    valor: "",
    fundo_municipal: [] as FundoMunicipal[],
    data_inicio: new Date(),
    data_termino: new Date()
  });

  useEffect(() => {
    if (mode === 'edit' && contrato) {
      setFormData({
        numero: contrato.numero,
        objeto: contrato.objeto,
        fornecedor_id: contrato.fornecedorId,
        valor: contrato.valor.toString(),
        fundo_municipal: Array.isArray(contrato.fundoMunicipal) 
          ? contrato.fundoMunicipal 
          : [contrato.fundoMunicipal as FundoMunicipal],
        data_inicio: contrato.dataInicio,
        data_termino: contrato.dataTermino
      });
    }
  }, [mode, contrato]);

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
      // Join multiple funds with comma if there are multiple funds selected
      const formattedFundos = formData.fundo_municipal.join(', ');
      
      const data = {
        numero: formData.numero,
        objeto: formData.objeto,
        fornecedor_id: formData.fornecedor_id,
        valor: parseFloat(formData.valor),
        fundo_municipal: formattedFundos,
        data_inicio: formData.data_inicio.toISOString(),
        data_termino: formData.data_termino.toISOString()
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

  const renderStepContent = () => {
    switch (formStep) {
      case "basic":
        return (
          <ContratoBasicInfo 
            numero={formData.numero}
            fornecedorId={formData.fornecedor_id}
            fundoMunicipal={formData.fundo_municipal}
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

  const renderFormFooter = () => {
    return (
      <div className="flex justify-between w-full mt-6">
        {formStep !== "basic" && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePreviousStep}
            disabled={loading}
          >
            Voltar
          </Button>
        )}
        
        <div className="ml-auto flex gap-2">
          <Button 
            variant="outline" 
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          {formStep !== "items" ? (
            <Button type="button" onClick={handleNextStep} disabled={loading}>
              Próximo
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      title={mode === 'create' ? "Novo Contrato" : "Editar Contrato"}
      description={mode === 'create' ? "Preencha os dados do novo contrato" : "Edite os dados do contrato"}
      loading={loading}
      footer={renderFormFooter()}
      step={formStep === "basic" ? 1 : formStep === "dates" ? 2 : 3}
      totalSteps={3}
    >
      {renderStepContent()}
    </FormSheet>
  );
};

export default ContratoFormDialog;
