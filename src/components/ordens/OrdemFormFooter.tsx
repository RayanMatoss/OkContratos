import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface OrdemFormFooterProps {
  loading: boolean;
  submitLabel: string;
  onGeneratePDF?: () => void;
  showGeneratePDF?: boolean;
}

export const OrdemFormFooter: React.FC<OrdemFormFooterProps> = ({
  loading,
  submitLabel,
  onGeneratePDF,
  showGeneratePDF = false
}) => {
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
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </div>
  );
};
