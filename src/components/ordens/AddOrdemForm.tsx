
import { Button } from "@/components/ui/button";
import OrdemFormFields from "./OrdemFormFields";
import OrdemItemsSelection from "./OrdemItemsSelection";
import { useOrdemForm } from "@/hooks/useOrdemForm";

type AddOrdemFormProps = {
  onSuccess?: () => void;
  onCancel: () => void;
};

export const AddOrdemForm = ({ onSuccess, onCancel }: AddOrdemFormProps) => {
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
    handleSubmit
  } = useOrdemForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <OrdemFormFields
        numero={numero}
        setNumero={setNumero}
        data={data}
        setData={setData}
        contratoId={contratoId}
        setContratoId={setContratoId}
        contratos={contratos}
      />
      
      {contratoId && (
        <OrdemItemsSelection
          selectedContratoId={contratoId}
          contratoItens={contratoItems}
          onItemsChange={setSelectedItems}
        />
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Criar Ordem</Button>
      </div>
    </form>
  );
};

export default AddOrdemForm;
