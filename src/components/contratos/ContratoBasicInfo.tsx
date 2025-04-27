
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FundoMunicipal, Fornecedor } from "@/types";

interface ContratoBasicInfoProps {
  numero: string;
  fornecedorId: string;
  fundoMunicipal: FundoMunicipal;
  objeto: string;
  valor: string;
  fornecedores: Fornecedor[];
  onFieldChange: (field: string, value: string) => void;
}

const ContratoBasicInfo = ({
  numero,
  fornecedorId,
  fundoMunicipal,
  objeto,
  valor,
  fornecedores,
  onFieldChange
}: ContratoBasicInfoProps) => {
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
          <Select
            value={fornecedorId}
            onValueChange={(value) => onFieldChange("fornecedor_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o fornecedor" />
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
            onValueChange={(value) => onFieldChange("fundo_municipal", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o fundo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Prefeitura">Prefeitura Municipal</SelectItem>
              <SelectItem value="Educação">Fundo Municipal de Educação</SelectItem>
              <SelectItem value="Saúde">Fundo Municipal de Saúde</SelectItem>
              <SelectItem value="Assistência">Fundo Municipal de Assistência</SelectItem>
            </SelectContent>
          </Select>
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
