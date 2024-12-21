import { Outlet, Navigate } from 'react-router-dom';
import { AppSidebar } from "./components/ui/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar"

function ProtectedRoute() {
  const value = localStorage.getItem('token');

 return value ? (
      <>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <main className="flex-1 pt-8 container mx-auto">
            
            <Outlet />
            
          </main>
        </SidebarProvider>
      </>
    ) : (
      <Navigate to="/" replace />
    );
}

export default ProtectedRoute;
