
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import OrdemFormFields from "./OrdemFormFields";
import OrdemItemsSelection from "./OrdemItemsSelection";
import { useOrdemForm } from "@/hooks/useOrdemForm";
import { useContratos } from "@/hooks/useContratos";
import { useOrdemItems } from "@/hooks/ordens/useOrdemItems";

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
  console.log("🚀 AddOrdemForm: Componente renderizando...", { open, onOpenChange, onSuccess, onCancel });
  
  // SOLUÇÃO DEFINITIVA: Verificar se o hook está sendo chamado
  console.log("🚀 AddOrdemForm: Antes de chamar useContratos...");
  const { contratos, loading: loadingContratos } = useContratos();
  console.log("🚀 AddOrdemForm: Hook retornou:", { contratos, loadingContratos });
  
  // VERIFICAÇÃO EXTRA: Log dos dados
  console.log("🚀 AddOrdemForm: Dados completos:", {
    contratos: contratos?.length || 0,
    loadingContratos,
    contratosArray: contratos
  });
  const {
    contratoId,
    setContratoId,
    data,
    setData,
    numero,
    setNumero,
    selectedItems,
    setSelectedItems,
    handleSubmit,
    loading
  } = useOrdemForm({ mode: 'create', onSuccess });
  
  const { contratoItems } = useOrdemItems(contratoId || '', 'create');

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
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">Nova Ordem de Fornecimento</DialogTitle>
                <DialogDescription className="mt-1">Preencha os dados para criar uma nova ordem de fornecimento</DialogDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
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
                    onItemsChange={setSelectedItems}
                    initialSelectedItems={selectedItems}
                    mode="create"
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
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !contratoId || selectedItems.length === 0}
              >
                {loading ? "Criando..." : "Criar Ordem"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
