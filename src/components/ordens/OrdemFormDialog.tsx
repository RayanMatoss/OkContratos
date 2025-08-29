
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useContratos } from "@/hooks/useContratos";
import { useOrdemForm } from "@/hooks/useOrdemForm";
import { useOrdemItems } from "@/hooks/ordens/useOrdemItems";
import { OrdemFormStepContent } from "./OrdemFormStepContent";
import { OrdemFormFooter } from "./OrdemFormFooter";
import { gerarPdfOrdem } from "@/lib/pdf/gerarPdfOrdem";
import { OrdemFornecimento } from "@/types";

type OrdemFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  ordem?: OrdemFornecimento;
  mode?: 'create' | 'edit';
};

export const OrdemFormDialog = ({ 
  open, 
  onOpenChange,
  onSuccess, 
  ordem,
  mode = 'create'
}: OrdemFormDialogProps) => {
  // Usar os hooks corretos
  const { contratos, loading: loadingContratos } = useContratos();
  
  const {
    contratoId,
    setContratoId,
    data,
    setData,
    numero,
    setNumero,
    justificativa,
    setJustificativa,
    selectedItems,
    handleSubmit,
    loading,
    submitting,
    selectFirstContrato,
    addItem,
    removeItem,
    updateItemQuantity
  } = useOrdemForm({ mode, initialOrdem: ordem, onSuccess });
  
  // AGORA contratoId já está definido!
  const { contratoItems } = useOrdemItems(contratoId || '', mode);
  
  // Seleção automática desabilitada para evitar problemas
  React.useEffect(() => {
    // NÃO executar seleção automática para evitar problemas
  }, []); // Dependências vazias para executar apenas uma vez

  const title = mode === 'create' ? "Nova Solicitação de Ordem" : "Editar Solicitação";
  const description = mode === 'create' 
    ? "Preencha os dados para criar uma nova solicitação de ordem de fornecimento"
    : "Edite os dados desta solicitação";
  const submitLabel = mode === 'create' ? "Criar Solicitação" : "Salvar Alterações";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleGeneratePDF = async () => {
    if (!ordem) return;
    
    try {
      await gerarPdfOrdem(ordem, ordem.contrato, ordem.contrato?.fornecedores?.[0], ordem.itens || []);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <OrdemFormStepContent
            contratos={contratos}
            loadingContratos={loadingContratos}
            contratoId={contratoId}
            setContratoId={setContratoId}
            data={data}
            setData={setData}
            numero={numero}
            setNumero={setNumero}
            justificativa={justificativa}
            setJustificativa={setJustificativa}
            selectedItems={selectedItems}
            contratoItems={contratoItems}
            mode={mode}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateItemQuantity}
          />

          <Separator />

          <OrdemFormFooter
            loading={loading}
            submitting={submitting}
            submitLabel={submitLabel}
            onGeneratePDF={handleGeneratePDF}
            showGeneratePDF={mode === 'edit' && !!ordem}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
