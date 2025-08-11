
import React from "react";
import { FormStep } from "@/types";
import ContratoBasicInfo from "./ContratoBasicInfo";
import ContratoDates from "./ContratoDates";
import ContratoItems from "./ContratoItems";
import { FundoMunicipal, Fornecedor } from "@/types";

interface ContratoFormStepContentProps {
  step: FormStep;
  formData: {
    numero: string;
    objeto: string;
    fornecedor_ids: string | string[];
    valor: string;
    fundo_municipal: FundoMunicipal[];
    data_inicio: Date;
    data_termino: Date;
    items?: { descricao: string; quantidade: number }[];
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
  // Ensure fornecedor_ids is always an array
  const fornecedorIds = Array.isArray(formData.fornecedor_ids) 
    ? formData.fornecedor_ids 
    : (formData.fornecedor_ids ? [formData.fornecedor_ids] : []);
  
  switch (step) {
    case "basic":
      return (
        <>
          <ContratoBasicInfo 
            numero={formData.numero || ""}
            fornecedorIds={fornecedorIds}
            objeto={formData.objeto || ""}
            valor={formData.valor || ""}
            fornecedores={fornecedores || []}
            onFieldChange={onFieldChange}
          />
          <ContratoDates
            dataInicio={formData.data_inicio || new Date()}
            dataTermino={formData.data_termino || new Date()}
            onDateChange={(field, date) => onFieldChange(field, date)}
          />
        </>
      );
    case "dates":
      return null;
    case "items":
      // Corrigir tipagem: garantir que todos os campos existem
      const items = (formData.items || []).map((item: any) => ({
        descricao: item.descricao || "",
        quantidade: item.quantidade || 0,
        unidade: item.unidade || "UN",
        valor_unitario: item.valor_unitario || item.valorUnitario || 0,
        fundos: item.fundos || []
      }));
      return (
        <ContratoItems
          items={items}
          onAddItem={(item) => onFieldChange("items", [...(formData.items || []), item])}
          onRemoveItem={(index) => {
            const newItems = [...(formData.items || [])];
            newItems.splice(index, 1);
            onFieldChange("items", newItems);
          }}
          fundosMunicipais={formData.fundo_municipal || []}
        />
      );
    default:
      return null;
  }
};
