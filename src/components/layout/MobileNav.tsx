import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Globe, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Dash', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { label: 'Rights', icon: <MessageSquare className="w-5 h-5" />, path: '/rights' },
    { label: 'Community', icon: <Globe className="w-5 h-5" />, path: '/community' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-bg-secondary border-t border-border z-40 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] flex items-center justify-around px-2 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center flex-1 h-full text-center gap-1 transition-all',
              isActive ? 'text-primary-400 font-bold' : 'text-text-secondary hover:text-text-primary'
            )
          }
        >
          {item.icon}
          <span className="text-[10px] tracking-wide font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
export default MobileNav;
