
import SidebarBrand from "./sidebar/SidebarBrand";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarProfile from "./sidebar/SidebarProfile";

const AppSidebar = () => {
  return (
    <aside className="w-64 h-screen bg-sidebar fixed left-0 top-0 border-r border-border flex flex-col">
      <SidebarBrand />
      <SidebarNavigation />
      <SidebarProfile />
    </aside>
  );
};

export default AppSidebar;
