import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FornecedorSelector from "./FornecedorSelector";
import FundoMunicipalSelector from "./FundoMunicipalSelector";
import { FundoMunicipal, Fornecedor } from "@/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ContratoBasicInfoProps {
  numero: string;
  fornecedorId: string | string[];
  fundoMunicipal: FundoMunicipal[];
  objeto: string;
  valor: string;
  fornecedores: Fornecedor[];
  onFieldChange: (field: string, value: string | number | string[]) => void;
}

const ContratoBasicInfo = ({
  numero,
  fornecedorId,
  fundoMunicipal = [], // Always provide a default empty array
  objeto,
  valor,
  fornecedores = [], // Default empty array for fornecedores
  onFieldChange
}: ContratoBasicInfoProps) => {
  // Ensure fundoMunicipal is always an array
  const selectedFundos = Array.isArray(fundoMunicipal) ? fundoMunicipal : [];

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
        <Label htmlFor="fornecedor">Fornecedor</Label>
        <FornecedorSelector
          value={typeof fornecedorId === 'string' ? fornecedorId : (Array.isArray(fornecedorId) && fornecedorId.length > 0 ? fornecedorId[0] : '')}
          onChange={(value) => onFieldChange("fornecedor_id", value)}
          fornecedores={fornecedores}
        />
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
