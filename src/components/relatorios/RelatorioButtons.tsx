import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Clock, Download } from "lucide-react";

interface RelatorioButtonsProps {
  onGerarRelatorioFornecedor: () => void;
  onGerarRelatorioVigencia: () => void;
  isLoading?: boolean;
}

export const RelatorioButtons: React.FC<RelatorioButtonsProps> = ({
  onGerarRelatorioFornecedor,
  onGerarRelatorioVigencia,
  isLoading = false
}) => {
  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <Button
        onClick={onGerarRelatorioFornecedor}
        disabled={isLoading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <FileText className="w-4 h-4" />
        Relatório por Fornecedor
        <Download className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={onGerarRelatorioVigencia}
        disabled={isLoading}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Clock className="w-4 h-4" />
        Relatório de Vigência
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}; 