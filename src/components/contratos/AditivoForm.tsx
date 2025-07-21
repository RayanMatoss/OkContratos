
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AditivoFormProps {
  contratoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AditivoForm: React.FC<AditivoFormProps> = ({
  contratoId,
  open,
  onOpenChange,
  onSuccess
}) => {
  const handleSubmit = () => {
    // Implementation for aditivo creation
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Aditivo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Funcionalidade de aditivos em desenvolvimento...</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AditivoForm;
