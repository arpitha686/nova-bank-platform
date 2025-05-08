
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CreditCard, ArrowRight, Settings, Users, BarChart, LogOut, PlusCircle, Banknote } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useBanking } from '@/contexts/BankingContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { currentUser, logout } = useBanking();
  const navigate = useNavigate();
  
  const isAdmin = currentUser?.role === 'admin';
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="px-2 py-6">
      <div className="space-y-1">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
            }`
          }
        >
          <Home className="mr-3 h-4 w-4" /> Dashboard
        </NavLink>
        
        <NavLink 
          to="/accounts" 
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
            }`
          }
        >
          <CreditCard className="mr-3 h-4 w-4" /> My Accounts
        </NavLink>
        
        <NavLink 
          to="/account-request" 
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
            }`
          }
        >
          <PlusCircle className="mr-3 h-4 w-4" /> New Account
        </NavLink>
        
        <NavLink 
          to="/fund-request" 
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
            }`
          }
        >
          <Banknote className="mr-3 h-4 w-4" /> Request Funds
        </NavLink>
        
        <NavLink 
          to="/transfer" 
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
            }`
          }
        >
          <ArrowRight className="mr-3 h-4 w-4" /> Transfers
        </NavLink>
      </div>
      
      <Separator className="my-4" />
      
      {isAdmin && (
        <div className="space-y-1 mb-4">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-sidebar-foreground/70">Admin</h3>
          </div>
          <NavLink 
            to="/admin" 
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
              }`
            }
          >
            <Users className="mr-3 h-4 w-4" /> Admin Panel
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
              }`
            }
          >
            <Users className="mr-3 h-4 w-4" /> Users
          </NavLink>
          
          <NavLink 
            to="/admin/analytics" 
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
              }`
            }
          >
            <BarChart className="mr-3 h-4 w-4" /> Analytics
          </NavLink>
          
          <Separator className="my-4" />
        </div>
      )}
      
      <div className="space-y-1">
        <NavLink 
          to="/settings" 
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
            }`
          }
        >
          <Settings className="mr-3 h-4 w-4" /> Settings
        </NavLink>
        
        <div 
          onClick={handleLogout}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer hover:bg-sidebar-accent/50 text-sidebar-foreground"
        >
          <LogOut className="mr-3 h-4 w-4" /> Logout
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
