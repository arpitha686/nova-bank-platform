
import React, { ReactNode } from 'react';
import { 
  SidebarProvider, 
  SidebarTrigger, 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";
import Navigation from '../shared/Navigation';
import Header from '../shared/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const MainLayout = ({ children, requireAuth = true, requireAdmin = false }: MainLayoutProps) => {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-banking-purple" />
        <span className="ml-2 text-banking-purple">Loading...</span>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Admin check will be performed in the Admin component

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {user && (
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center p-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || '')}&background=8B5CF6&color=fff`}
                    alt={user.email || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{user.email?.split('@')[0] || "User"}</h3>
                  <p className="text-xs text-muted-foreground">User</p>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <Navigation />
            </SidebarContent>
            <SidebarFooter>
              <div className="p-4">
                <p className="text-xs text-center text-muted-foreground">
                  © {new Date().getFullYear()} Nova Bank
                </p>
              </div>
            </SidebarFooter>
          </Sidebar>
        )}
        
        <main className="flex-1 flex flex-col min-h-screen">
          {user && <Header />}
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
