
import ChartContainer from "@/components/ChartContainer";

interface OrderItem {
  id: string;
  numero: string;
  data_emissao: string;
  contrato?: {
    numero: string;
  };
}

interface PendingOrdersProps {
  orders: OrderItem[];
}

const PendingOrders = ({ orders }: PendingOrdersProps) => {
  return (
    <ChartContainer title="Ordens Pendentes">
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((ordem) => (
            <div 
              key={ordem.id} 
              className="flex items-center justify-between border-b border-border pb-3"
            >
              <div>
                <p className="font-medium">{ordem.numero}</p>
                <p className="text-sm text-muted-foreground">
                  Contrato: {ordem.contrato?.numero}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(ordem.data_emissao).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Nenhuma ordem pendente</p>
        </div>
      )}
    </ChartContainer>
  );
};

export default PendingOrders;
