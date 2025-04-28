
import { cn } from "@/lib/utils";
import { StatusContrato, StatusOrdem } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: StatusContrato | StatusOrdem;
  className?: string;
}

const getStatusColor = (status: StatusContrato | StatusOrdem) => {
  switch (status) {
    case "Ativo":
    case "Concluída":
      return "bg-success/20 text-success border-success/30";
    case "A Vencer":
    case "Pendente":
      return "bg-warning/20 text-warning border-warning/30";
    case "Expirado":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "Em Aprovação":
      return "bg-info/20 text-info border-info/30";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

const getStatusIcon = (status: StatusContrato | StatusOrdem) => {
  switch (status) {
    case "Ativo":
      return "●"; // Active dot
    case "Concluída":
      return "✓"; // Check mark
    case "A Vencer":
      return "⚠"; // Warning
    case "Pendente":
      return "⏳"; // Hourglass
    case "Expirado":
      return "⊗"; // X mark in circle
    case "Em Aprovação":
      return "⋯"; // Ellipsis
    default:
      return "";
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const icon = getStatusIcon(status);
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusColor(status),
        className
      )}
    >
      <span className="text-xs">{icon}</span>
      {status}
    </span>
  );
};

export default StatusBadge;
