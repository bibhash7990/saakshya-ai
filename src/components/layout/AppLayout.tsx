import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../ui/Toast';
import { AuthGuard } from '../auth/AuthGuard';

interface AppLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ title, children }) => {
  return (
    <AuthGuard>
      <div className="flex h-screen text-text-primary bg-bg-primary overflow-hidden">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Right Content Panel */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto pb-24 lg:pb-0">
          {/* Top Bar Navigation */}
          <TopNav title={title} />

          {/* Main Area */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav />

        {/* System-wide active toast messages overlay */}
        <ToastContainer />
      </div>
    </AuthGuard>
  );
};
export default AppLayout;
