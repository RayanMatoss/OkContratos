<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  iconColor?: string;
  className?: string;
<<<<<<< HEAD
<<<<<<< HEAD
  onClick?: () => void;
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
  onClick?: () => void;
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
}

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  description,
  iconColor,
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  className,
  onClick
}: DashboardCardProps) => {
  return (
    <div
      className={cn(
        "bg-secondary rounded-lg p-5 border border-border hover-card",
        className
      )}
      style={onClick ? { cursor: 'pointer' } : {}}
      onClick={onClick}
    >
<<<<<<< HEAD
=======
  className
}: DashboardCardProps) => {
  return (
    <div className={cn(
      "bg-secondary rounded-lg p-5 border border-border hover-card",
      className
    )}>
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
