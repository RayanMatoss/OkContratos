
import React from "react";
import { FormSheet } from "@/components/ui/form-sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0 flex flex-col">
        <form onSubmit={handleFormSubmit} className="h-full flex flex-col">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b bg-muted/30 dark:bg-muted/20 flex-shrink-0">
            <div>
              <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
              <DialogDescription className="mt-1">{description}</DialogDescription>
            </div>
          </DialogHeader>

          {/* Content with scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-6 space-y-6">
              {mode === 'edit' && ordem && (
                <button
                  type="button"
                  className="bg-primary text-primary-foreground rounded px-3 py-1 text-sm font-semibold hover:bg-primary/90 transition mb-2"
                  onClick={() => gerarPdfOrdem(ordem, ordem.contrato, ordem.contrato?.fornecedor, ordem.itens || [])}
                >
                  Baixar PDF
                </button>
              )}

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
                  loadingNumero={loadingNumero}
                  mode={mode}
                />
              </div>
              
              {/* Tabela de itens */}
              {contratoId && (
                <div className="bg-card border rounded-lg p-4">
                  <OrdemItemsSelection
                    selectedContratoId={contratoId}
                    contratoItens={contratoItems}
                    onItemsChange={setSelectedItems}
                    initialSelectedItems={selectedItems}
                    mode={mode}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-muted/30 dark:bg-muted/20 flex justify-end gap-3 flex-shrink-0">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrdemFormDialog;
