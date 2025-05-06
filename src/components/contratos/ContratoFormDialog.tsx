import { useContratoForm } from "@/hooks/useContratoForm";
import { FormSheet } from "@/components/ui/form-sheet";
import { ContratoFormStepContent } from "./ContratoFormStepContent";
import { ContratoFormFooter } from "./ContratoFormFooter";
import { useFornecedores } from "@/hooks/useFornecedores";
import { Contrato } from "@/types";

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
  const { fornecedores } = useFornecedores(open);
  
  const {
    formData,
    formStep,
    loading,
    handleFieldChange,
    handleNextStep,
    handlePreviousStep,
    handleSubmit
  } = useContratoForm({
    mode,
    contrato,
    onSuccess,
    onOpenChange
  });

  const formFooter = (
    <ContratoFormFooter
      formStep={formStep}
      loading={loading}
      onPrevious={handlePreviousStep}
      onNext={handleNextStep}
      onCancel={() => onOpenChange(false)}
    />
  );

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      title={mode === 'create' ? "Novo Contrato" : "Editar Contrato"}
      description={mode === 'create' ? "Preencha os dados do novo contrato" : "Edite os dados do contrato"}
      loading={loading}
      footer={formFooter}
      step={formStep === "basic" ? 1 : 2}
      totalSteps={2}
    >
      <ContratoFormStepContent
        step={formStep}
        formData={formData}
        fornecedores={fornecedores || []}
        onFieldChange={handleFieldChange}
      />
    </FormSheet>
  );
};

export default ContratoFormDialog;
