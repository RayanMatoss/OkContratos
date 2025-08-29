import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface OrdemFormFooterProps {
  loading: boolean;
  submitting?: boolean;
  submitLabel: string;
  onGeneratePDF?: () => void;
  showGeneratePDF?: boolean;
}

export const OrdemFormFooter: React.FC<OrdemFormFooterProps> = ({
  loading,
  submitting = false,
  submitLabel,
  onGeneratePDF,
  showGeneratePDF = false
}) => {
  const isSubmitting = loading || submitting;
  
  const getSubmitText = () => {
    if (submitting) {
      return "Criando solicitação...";
    }
    if (loading) {
      return "Carregando...";
    }
    return submitLabel;
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {showGeneratePDF && onGeneratePDF && (
          <Button
            type="button"
            variant="outline"
            onClick={onGeneratePDF}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Gerar PDF
          </Button>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {getSubmitText()}
        </Button>
      </div>
    </div>
  );
};
