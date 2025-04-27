
import { cn } from "@/lib/utils";
import { StatusContrato, StatusOrdem } from "@/types";

interface StatusBadgeProps {
  status: StatusContrato | StatusOrdem;
  className?: string;
}

const getStatusColor = (status: StatusContrato | StatusOrdem) => {
  switch (status) {
    case "Ativo":
    case "Aprovada":
    case "Concluída":
      return "bg-success/20 text-success border-success/30";
    case "A Vencer":
    case "Pendente":
      return "bg-warning/20 text-warning border-warning/30";
    case "Expirado":
    case "Cancelada":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "Em Aprovação":
      return "bg-info/20 text-info border-info/30";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusColor(status),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
