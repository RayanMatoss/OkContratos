
import React from "react";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { FormStep } from "@/types";
=======
import { FormStep } from "@/hooks/useContratoForm";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654

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
<<<<<<< HEAD
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
=======
        
        {formStep !== "items" ? (
          <Button type="button" onClick={onNext} disabled={loading}>
            Próximo
          </Button>
        ) : (
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        )}
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
      </div>
    </div>
  );
};
