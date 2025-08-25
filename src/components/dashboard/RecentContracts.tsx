
import ChartContainer from "@/components/ChartContainer";

interface ContractItem {
  id: string;
  numero: string;
  objeto: string;
  fornecedor?: {
    nome: string;
  };
}

interface RecentContractsProps {
  contratos: ContractItem[];
}

const RecentContracts = ({ contratos }: RecentContractsProps) => {
  return (
    <ChartContainer title="Contratos Recentes">
      {contratos.length > 0 ? (
        <div className="space-y-4">
          {contratos.map((contrato) => (
            <div 
              key={contrato.id} 
              className="flex items-center justify-between border-b border-border pb-3"
            >
              <div>
                <p className="font-medium">{contrato.numero}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {contrato.objeto}
                </p>
                <p className="text-xs text-muted-foreground">
                  {contrato.fornecedor?.nome}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Nenhum contrato encontrado</p>
        </div>
      )}
    </ChartContainer>
  );
};

export default RecentContracts;
