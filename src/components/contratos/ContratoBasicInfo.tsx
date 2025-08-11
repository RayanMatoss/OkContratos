<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FornecedorSelector from "./FornecedorSelector";
import { FundoMunicipal, Fornecedor } from "@/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ContratoBasicInfoProps {
  numero: string;
  fornecedorIds: string | string[];
<<<<<<< HEAD
=======

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FornecedorSelector from "./FornecedorSelector";
import FundoMunicipalSelector from "./FundoMunicipalSelector";
import { FundoMunicipal, Fornecedor } from "@/types";

interface ContratoBasicInfoProps {
  numero: string;
  fornecedorId: string;
  fundoMunicipal: FundoMunicipal[];
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  objeto: string;
  valor: string;
  fornecedores: Fornecedor[];
  onFieldChange: (field: string, value: any) => void;
}

const ContratoBasicInfo = ({
  numero,
<<<<<<< HEAD
<<<<<<< HEAD
  fornecedorIds,
=======
  fornecedorId,
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
  fornecedorIds,
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  fundoMunicipal = [], // Always provide a default empty array
  objeto,
  valor,
  fornecedores = [], // Default empty array for fornecedores
  onFieldChange
}: ContratoBasicInfoProps) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  // Ensure fornecedorIds is always an array for compatibility
  const selectedFornecedores = Array.isArray(fornecedorIds) ? fornecedorIds : (fornecedorIds ? [fornecedorIds] : []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="numero">Número do Contrato</Label>
        <Input
          id="numero"
          placeholder="Digite o número do contrato"
          value={numero}
          onChange={(e) => onFieldChange("numero", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fornecedores">Fornecedor</Label>
        <FornecedorSelector
          value={selectedFornecedores}
          onChange={(value) => onFieldChange("fornecedor_ids", value)}
          fornecedores={fornecedores}
          isMulti={false}
        />
        <div className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="font-medium mb-1">💡 Sistema de Sufixos</p>
          <p className="text-xs">
            Para criar contratos com múltiplos fornecedores, crie um contrato para cada fornecedor com o mesmo número base. 
            O sistema automaticamente atribuirá sufixos únicos (ex: 001.1/2025, 001.2/2025) para controle individual de saldo.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="valor">Valor do Contrato</Label>
        <Input
          id="valor"
          type="number"
          placeholder="Digite o valor"
          value={valor}
          onChange={(e) => onFieldChange("valor", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
<<<<<<< HEAD
=======
  // Ensure fundoMunicipal is always an array
  const selectedFundos = Array.isArray(fundoMunicipal) ? fundoMunicipal : [];

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero">Número do Contrato</Label>
          <Input
            id="numero"
            placeholder="Digite o número do contrato"
            value={numero}
            onChange={(e) => onFieldChange("numero", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fornecedor">Fornecedor</Label>
          <FornecedorSelector
            value={fornecedorId}
            onChange={(value) => onFieldChange("fornecedor_id", value)}
            fornecedores={fornecedores}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fundo">Fundos Municipais</Label>
          <FundoMunicipalSelector
            selectedFundos={selectedFundos}
            onChange={(value) => onFieldChange("fundo_municipal", value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor">Valor do Contrato</Label>
          <Input
            id="valor"
            type="number"
            placeholder="Digite o valor"
            value={valor}
            onChange={(e) => onFieldChange("valor", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        <Label htmlFor="objeto">Objeto do Contrato</Label>
        <Input
          id="objeto"
          placeholder="Digite o objeto do contrato"
          value={objeto}
          onChange={(e) => onFieldChange("objeto", e.target.value)}
        />
      </div>
    </div>
  );
};

export default ContratoBasicInfo;
