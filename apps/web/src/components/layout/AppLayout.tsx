import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '@/hooks/useAuth';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/contacts': 'Contacts',
  '/companies': 'Companies',
  '/deals': 'Deals',
  '/activities': 'Activities',
};

const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const pathBase = '/' + (location.pathname.split('/')[1] || '');
  const pageTitle = pageTitles[pathBase] || 'CRM Demo';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
