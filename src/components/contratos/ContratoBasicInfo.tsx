import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FornecedorSelector from "./FornecedorSelector";
import FundoMunicipalSelector from "./FundoMunicipalSelector";
import { FundoMunicipal, Fornecedor } from "@/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ContratoBasicInfoProps {
  numero: string;
  fornecedorId: string;
  fundoMunicipal: FundoMunicipal[];
  objeto: string;
  valor: string;
  fornecedores: Fornecedor[];
  onFieldChange: (field: string, value: any) => void;
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
