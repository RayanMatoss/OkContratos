import React from 'react';
import { Button } from "@/components/ui/button";

interface PeriodoRelatorioSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const PeriodoRelatorioSelector: React.FC<PeriodoRelatorioSelectorProps> = ({
  value,
  onValueChange,
  className
}) => {
  const periodos = [
    { value: "30d", label: "30 dias" },
    { value: "6m", label: "6 meses" },
    { value: "1y", label: "1 ano" }
  ];

  return (
    <div className={`flex gap-2 ${className}`}>
      {periodos.map((periodo) => (
        <Button
          key={periodo.value}
          variant={value === periodo.value ? "default" : "outline"}
          size="sm"
          onClick={() => onValueChange(periodo.value)}
          className="flex-1"
        >
          {periodo.label}
        </Button>
      ))}
    </div>
  );
}; 