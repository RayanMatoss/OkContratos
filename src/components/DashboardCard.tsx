
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  iconColor?: string;
  className?: string;
}

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  description,
  iconColor,
  className
}: DashboardCardProps) => {
  return (
    <div className={cn(
      "bg-secondary rounded-lg p-5 border border-border hover-card",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold">{value}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={cn(
          "p-2 rounded-md",
          iconColor || "text-primary"
        )}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
