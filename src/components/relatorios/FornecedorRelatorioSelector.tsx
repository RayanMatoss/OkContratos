import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFornecedores } from "@/hooks/fornecedores";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

interface FornecedorRelatorioSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const FornecedorRelatorioSelector: React.FC<FornecedorRelatorioSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Escolha um fornecedor",
  className
}) => {
  const { fornecedores, isLoading } = useFornecedores(true);
  const [isOpen, setIsOpen] = React.useState(false);

  // Debug: verificar dados
  console.log('FornecedorRelatorioSelector - fornecedores:', fornecedores);
  console.log('FornecedorRelatorioSelector - isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <Button variant="outline" className="w-full justify-between" disabled>
          Carregando...
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    );
  }

        const selectedFornecedor = fornecedores.find(f => f.id === value);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedFornecedor?.nome || placeholder}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="p-1">
        {fornecedores && fornecedores.length > 0 ? (
              fornecedores.map((fornecedor) => (
                <Button
                  key={fornecedor.id}
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    onValueChange(fornecedor.id);
                    setIsOpen(false);
                  }}
                >
                  {value === fornecedor.id && <Check className="h-4 w-4 mr-2" />}
                  {fornecedor.nome}
                </Button>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                Nenhum fornecedor encontrado
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay para fechar ao clicar fora */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}; 