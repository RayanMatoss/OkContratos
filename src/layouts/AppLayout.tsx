
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";

const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
<<<<<<< HEAD
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
=======
    <div className="min-h-screen bg-background text-foreground">
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
      <AppSidebar />
      <AppHeader 
        onToggleSidebar={handleToggleSidebar} 
        isSidebarCollapsed={isSidebarCollapsed} 
      />
      <main
<<<<<<< HEAD
        className={`flex-1 pt-16 transition-all duration-300 overflow-y-auto ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="px-6 py-6 min-h-full">
=======
        className={`min-h-screen pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="px-6 py-6">
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
