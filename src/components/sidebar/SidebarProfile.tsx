
import { Users } from "lucide-react";

const SidebarProfile = () => {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
          <Users size={20} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Admin Sistema</p>
          <p className="text-xs text-muted-foreground">admin@sistema.gov.br</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;
