import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  Activity,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/deals', label: 'Deals', icon: DollarSign },
  { to: '/activities', label: 'Activities', icon: Activity },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-brand-900 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">CRM Demo</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-white/10 p-4">
        {!collapsed && user && (
          <div className="mb-3">
            <p className="text-sm font-medium truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-300',
            'hover:bg-white/10 hover:text-white transition-colors'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
