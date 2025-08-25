import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FornecedorSelector from "./FornecedorSelector";
import FundoMunicipalSelector from "./FundoMunicipalSelector";
import { FundoMunicipal, Fornecedor } from "@/types";

interface ContratoBasicInfoProps {
  numero: string;
  fornecedorIds: string | string[];
  fundoMunicipal?: FundoMunicipal[];
  objeto: string;
  valor: string;
  fornecedores: Fornecedor[];
  onFieldChange: (field: string, value: any) => void;
}

const ContratoBasicInfo = ({
  numero,
  fornecedorIds,
  fundoMunicipal = [], // Always provide a default empty array
  objeto,
  valor,
  fornecedores = [], // Default empty array for fornecedores
  onFieldChange
}: ContratoBasicInfoProps) => {
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
        <Label htmlFor="fundo">Fundos Municipais</Label>
        <FundoMunicipalSelector
          selectedFundos={fundoMunicipal}
          onChange={(value) => onFieldChange("fundo_municipal", value)}
        />
      </div>
      <div className="flex flex-col gap-2">
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
