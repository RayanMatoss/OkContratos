
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ItensHeaderProps {
  onAddItem: () => void;
}

export const ItensHeader = ({ onAddItem }: ItensHeaderProps) => {
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Itens</h1>
        <p className="text-muted-foreground">
          Gerenciamento dos itens cadastrados em contratos
        </p>
      </div>
      <Button onClick={onAddItem} className="flex items-center gap-2">
        <Plus size={16} />
        <span>Novo Item</span>
      </Button>
    </div>
  );
};
