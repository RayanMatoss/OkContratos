
import React from "react";
import { FormStep } from "@/hooks/useContratoForm";
import ContratoBasicInfo from "./ContratoBasicInfo";
import ContratoDates from "./ContratoDates";
import ContratoItems from "./ContratoItems";
import { FundoMunicipal, Fornecedor } from "@/types";

interface ContratoFormStepContentProps {
  step: FormStep;
  formData: {
    numero: string;
    objeto: string;
    fornecedor_id: string;
    valor: string;
    fundo_municipal: FundoMunicipal[];
    data_inicio: Date;
    data_termino: Date;
  };
  fornecedores: Fornecedor[];
  onFieldChange: (field: string, value: any) => void;
}

export const ContratoFormStepContent: React.FC<ContratoFormStepContentProps> = ({
  step,
  formData,
  fornecedores,
  onFieldChange
}) => {
  switch (step) {
    case "basic":
      return (
        <ContratoBasicInfo 
          numero={formData.numero}
          fornecedorId={formData.fornecedor_id}
          fundoMunicipal={formData.fundo_municipal}
          objeto={formData.objeto}
          valor={formData.valor}
          fornecedores={fornecedores}
          onFieldChange={onFieldChange}
        />
      );
    case "dates":
      return (
        <ContratoDates
          dataInicio={formData.data_inicio}
          dataTermino={formData.data_termino}
          onDateChange={(field, date) => onFieldChange(field, date)}
        />
      );
    case "items":
      return <ContratoItems />;
    default:
      return null;
  }
};
