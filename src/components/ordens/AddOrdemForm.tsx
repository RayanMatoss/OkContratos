
import { FormSheet } from "@/components/ui/form-sheet";
import OrdemFormFields from "./OrdemFormFields";
import OrdemItemsSelection from "./OrdemItemsSelection";
import { useOrdemForm } from "@/hooks/useOrdemForm";

type AddOrdemFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onCancel: () => void;
};

export const AddOrdemForm = ({ 
  open, 
  onOpenChange,
  onSuccess, 
  onCancel 
}: AddOrdemFormProps) => {
  const {
    data,
    setData,
    numero,
    setNumero,
    contratos,
    contratoItems,
    contratoId,
    setContratoId,
    selectedItems,
    setSelectedItems,
    handleSubmit,
    loading,
    loadingNumero
  } = useOrdemForm(onSuccess);

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Nova Ordem de Fornecimento"
      description="Preencha os dados para criar uma nova ordem de fornecimento"
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Criar Ordem"
    >
      <div className="space-y-6">
        <OrdemFormFields
          numero={numero}
          setNumero={setNumero}
          data={data}
          setData={setData}
          contratoId={contratoId}
          setContratoId={setContratoId}
          contratos={contratos}
          loadingNumero={loadingNumero}
        />
        
        {contratoId && (
          <OrdemItemsSelection
            selectedContratoId={contratoId}
            contratoItens={contratoItems}
            onItemsChange={setSelectedItems}
          />
        )}
      </div>
    </FormSheet>
  );
};

export default AddOrdemForm;
