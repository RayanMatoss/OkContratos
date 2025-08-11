
import React from "react";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
<<<<<<< HEAD
import { FormStep } from "@/types";
=======
import { FormStep } from "@/hooks/useContratoForm";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
import { FormStep } from "@/types";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

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
=======
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
      </div>
    </div>
  );
};
