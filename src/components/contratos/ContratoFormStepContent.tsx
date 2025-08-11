<<<<<<< HEAD
<<<<<<< HEAD

import React from "react";
import { FormStep } from "@/types";
=======
import React from "react";
import { FormStep } from "@/hooks/useContratoForm";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======

import React from "react";
import { FormStep } from "@/types";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import ContratoBasicInfo from "./ContratoBasicInfo";
import ContratoDates from "./ContratoDates";
import ContratoItems from "./ContratoItems";
import { FundoMunicipal, Fornecedor } from "@/types";

interface ContratoFormStepContentProps {
  step: FormStep;
  formData: {
    numero: string;
    objeto: string;
<<<<<<< HEAD
<<<<<<< HEAD
    fornecedor_ids: string | string[];
=======
    fornecedor_id: string;
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
    fornecedor_ids: string | string[];
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  // Ensure fornecedor_ids is always an array
  const fornecedorIds = Array.isArray(formData.fornecedor_ids) 
    ? formData.fornecedor_ids 
    : (formData.fornecedor_ids ? [formData.fornecedor_ids] : []);
<<<<<<< HEAD
=======
  // Ensure fundo_municipal is always an array
  const fundoMunicipal = Array.isArray(formData.fundo_municipal) 
    ? formData.fundo_municipal 
    : [];
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  
  switch (step) {
    case "basic":
      return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
=======
        <ContratoBasicInfo 
          numero={formData.numero || ""}
          fornecedorId={formData.fornecedor_id || ""}
          fundoMunicipal={fundoMunicipal}
          objeto={formData.objeto || ""}
          valor={formData.valor || ""}
          fornecedores={fornecedores || []}
          onFieldChange={onFieldChange}
        />
      );
    case "dates":
      return (
        <ContratoDates
          dataInicio={formData.data_inicio || new Date()}
          dataTermino={formData.data_termino || new Date()}
          onDateChange={(field, date) => onFieldChange(field, date)}
        />
      );
    case "items":
      return (
        <ContratoItems
          items={formData.items || []}
          onAddItem={item => onFieldChange("items", [...(formData.items || []), item])}
          onRemoveItem={idx => onFieldChange("items", (formData.items || []).filter((_, i) => i !== idx))}
          fundosMunicipais={fundoMunicipal}
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        />
      );
    default:
      return null;
  }
};
