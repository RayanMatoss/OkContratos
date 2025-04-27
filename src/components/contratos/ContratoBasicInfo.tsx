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
  onFieldChange
}: ContratoBasicInfoProps) => {
  return <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        
        
      </div>

      <div className="grid grid-cols-2 gap-4">
        
        
      </div>

      
    </div>;
};
export default ContratoBasicInfo;