
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fornecedores } from "@/data/mockData";
import { FundoMunicipal } from "@/types";

interface ContratoBasicInfoProps {
  numero: string;
  fornecedorId: string;
  fundoMunicipal: FundoMunicipal;
  objeto: string;
  valor: string;
  onFieldChange: (field: string, value: string) => void;
}

const ContratoBasicInfo = ({
  numero,
  fornecedorId,
  fundoMunicipal,
  objeto,
  valor,
  onFieldChange,
}: ContratoBasicInfoProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero">Número do Contrato</Label>
          <Input
            id="numero"
            placeholder="2023/001"
            value={numero}
            onChange={(e) => onFieldChange("numero", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fornecedor">Fornecedor</Label>
          <Select
            value={fornecedorId}
            onValueChange={(value) => onFieldChange("fornecedorId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um fornecedor" />
            </SelectTrigger>
            <SelectContent>
              {fornecedores.map((fornecedor) => (
                <SelectItem key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fundo">Fundo Municipal</Label>
          <Select
            value={fundoMunicipal}
            onValueChange={(value) =>
              onFieldChange("fundoMunicipal", value as FundoMunicipal)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um fundo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Prefeitura">Prefeitura</SelectItem>
              <SelectItem value="Educação">Educação</SelectItem>
              <SelectItem value="Saúde">Saúde</SelectItem>
              <SelectItem value="Assistência">Assistência</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="valor">Valor do Contrato</Label>
          <Input
            id="valor"
            placeholder="0,00"
            value={valor}
            onChange={(e) => onFieldChange("valor", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="objeto">Objeto do Contrato</Label>
        <Input
          id="objeto"
          placeholder="Descreva o objeto do contrato"
          value={objeto}
          onChange={(e) => onFieldChange("objeto", e.target.value)}
        />
      </div>
    </div>
  );
};

export default ContratoBasicInfo;
