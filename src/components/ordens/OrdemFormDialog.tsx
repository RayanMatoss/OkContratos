
import { FormSheet } from "@/components/ui/form-sheet";
import OrdemFormFields from "./OrdemFormFields";
import OrdemItemsSelection from "./OrdemItemsSelection";
import { useOrdemForm } from "@/hooks/useOrdemForm";
import { OrdemFornecimento } from "@/types";
import { gerarPdfOrdem } from "@/lib/pdf/gerarPdfOrdem";

type OrdemFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  ordem?: OrdemFornecimento; // Optional order for edit mode
  mode: 'create' | 'edit';
};

export const OrdemFormDialog = ({ 
  open, 
  onOpenChange,
  onSuccess, 
  ordem,
  mode = 'create'
}: OrdemFormDialogProps) => {
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
  } = useOrdemForm(onSuccess, ordem, mode);

  const title = mode === 'create' ? "Nova Ordem de Fornecimento" : "Editar Ordem de Fornecimento";
  const description = mode === 'create' 
    ? "Preencha os dados para criar uma nova ordem de fornecimento"
    : "Edite os dados desta ordem de fornecimento";
  const submitLabel = mode === 'create' ? "Criar Ordem" : "Salvar Alterações";

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel={submitLabel}
    >
      <div className="space-y-6">
        {mode === 'edit' && ordem && (
          <button
            type="button"
            className="bg-primary text-white rounded px-3 py-1 text-sm font-semibold hover:bg-primary/90 transition mb-2"
            onClick={() => gerarPdfOrdem(ordem, ordem.contrato, ordem.contrato?.fornecedor, ordem.itens || [])}
          >
            Baixar PDF
          </button>
        )}
        <OrdemFormFields
          numero={numero}
          setNumero={setNumero}
          data={data}
          setData={setData}
          contratoId={contratoId}
          setContratoId={setContratoId}
          contratos={contratos}
          loadingNumero={loadingNumero}
          mode={mode}
        />
        
        {contratoId && (
          <OrdemItemsSelection
            selectedContratoId={contratoId}
            contratoItens={contratoItems}
            onItemsChange={setSelectedItems}
            initialSelectedItems={selectedItems}
            mode={mode}
          />
        )}
      </div>
    </FormSheet>
  );
};

export default OrdemFormDialog;
