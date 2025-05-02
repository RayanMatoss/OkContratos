
import React from "react";
import { Button } from "@/components/ui/button";
import { FormStep } from "@/hooks/useContratoForm";

interface ContratoFormFooterProps {
  formStep: FormStep;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
}

export const ContratoFormFooter: React.FC<ContratoFormFooterProps> = ({
  formStep,
  loading,
  onPrevious,
  onNext,
  onCancel
}) => {
  return (
    <div className="flex justify-between w-full mt-6">
      {formStep !== "basic" && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          disabled={loading}
        >
          Voltar
        </Button>
      )}
      
      <div className="ml-auto flex gap-2">
        <Button 
          variant="outline" 
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        {formStep !== "items" ? (
          <Button type="button" onClick={onNext} disabled={loading}>
            Próximo
          </Button>
        ) : (
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        )}
      </div>
    </div>
  );
};
