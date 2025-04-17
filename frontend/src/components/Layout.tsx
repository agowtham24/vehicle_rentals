// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
const MainLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-1.5 w-full h-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
