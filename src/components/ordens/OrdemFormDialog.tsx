
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OrdemFormFields from "./OrdemFormFields";
import OrdemItemsSelection from "./OrdemItemsSelection";
import { useOrdemForm } from "@/hooks/useOrdemForm";
import { useContratos } from "@/hooks/useContratos";
import { useOrdemItems } from "@/hooks/ordens/useOrdemItems";
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
  // Usar os hooks corretos
  const { contratos, loading: loadingContratos } = useContratos();
  
  const {
    contratoId,
    setContratoId,
    data,
    setData,
    numero,
    setNumero,
    selectedItems,
    handleSubmit,
    loading,
    selectFirstContrato
  } = useOrdemForm({ mode, initialOrdem: ordem, onSuccess });
  
  // AGORA contratoId já está definido!
  const { contratoItems } = useOrdemItems(contratoId || '', mode);
  
  // Seleção automática desabilitada para evitar problemas
  React.useEffect(() => {
    // NÃO executar seleção automática para evitar problemas
  }, []); // Dependências vazias para executar apenas uma vez

  const title = mode === 'create' ? "Nova Ordem de Fornecimento" : "Editar Ordem de Fornecimento";
  const description = mode === 'create' 
    ? "Preencha os dados para criar uma nova ordem de fornecimento"
    : "Edite os dados desta ordem de fornecimento";
  const submitLabel = mode === 'create' ? "Criar Ordem" : "Salvar Alterações";

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
      <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0 flex flex-col">
        <form onSubmit={handleFormSubmit} className="h-full flex flex-col">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b bg-muted/30 dark:bg-muted/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                <DialogDescription className="mt-1">{description}</DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {mode === 'edit' && ordem && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePDF}
                    className="h-8"
                  >
                    Gerar PDF
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Content with scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Campos básicos em layout horizontal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-card border rounded-lg p-4">
                <OrdemFormFields
                  numero={numero}
                  setNumero={setNumero}
                  data={data}
                  setData={setData}
                  contratoId={contratoId}
                  setContratoId={setContratoId}
                  contratos={contratos}
                  loadingContratos={loadingContratos}
                />
              </div>

              {/* Seleção de itens */}
              {contratoId && (
                <div className="bg-card border rounded-lg p-4">
                  <OrdemItemsSelection
                    selectedContratoId={contratoId}
                    contratoItens={contratoItems}
                    onItemsChange={() => {}}
                    initialSelectedItems={selectedItems}
                    mode={mode}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-muted/30 dark:bg-muted/20 flex-shrink-0">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !contratoId || selectedItems.length === 0}
              >
                {loading ? "Salvando..." : submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
