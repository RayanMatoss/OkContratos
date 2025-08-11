
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
              <DialogTitle className="text-xl font-semibold">Nova Ordem de Fornecimento</DialogTitle>
              <DialogDescription className="mt-1">Preencha os dados para criar uma nova ordem de fornecimento</DialogDescription>
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
                  loadingNumero={loadingNumero}
                />
              </div>
              
              {/* Tabela de itens */}
              {contratoId && (
                <div className="bg-card border rounded-lg p-4">
                  <OrdemItemsSelection
                    selectedContratoId={contratoId}
                    contratoItens={contratoItems}
                    onItemsChange={setSelectedItems}
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
              {loading ? "Salvando..." : "Criar Ordem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrdemForm;
