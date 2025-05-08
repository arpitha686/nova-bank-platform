
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
import { useBanking } from '@/contexts/BankingContext';
import { Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const MainLayout = ({ children, requireAuth = true, requireAdmin = false }: MainLayoutProps) => {
  const { currentUser } = useBanking();
  
  // Redirect if not authenticated
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect if not admin
  if (requireAdmin && (!currentUser || currentUser.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {currentUser && (
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center p-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=8B5CF6&color=fff`} 
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{currentUser.name}</h3>
                  <p className="text-xs text-muted-foreground">{currentUser.role}</p>
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
          {currentUser && <Header />}
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
