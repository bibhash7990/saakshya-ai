import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  ShieldAlert,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Globe,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { label: 'Know Your Rights', icon: <MessageSquare className="w-5 h-5" />, path: '/rights' },
    { label: 'Community Hub', icon: <Globe className="w-5 h-5" />, path: '/community' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-bg-secondary p-6 h-screen sticky top-0">
      {/* Brand logo */}
      <div className="flex items-center gap-2.5 mb-10 select-none cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8.5 h-8.5 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-glow">
          <ShieldAlert className="w-4.5 h-4.5" />
        </div>
        <span className="font-bold text-base tracking-wider text-text-primary">
          Saakshya<span className="text-primary-500">AI</span>
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150',
                isActive
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/25'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40 border border-transparent'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile card & Signout */}
      <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-border">
        <div className="flex items-center gap-3 px-1 py-0.5">
          <div className="w-10 h-10 rounded-full bg-bg-tertiary border border-border flex items-center justify-center text-primary-400 overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-xs font-bold text-text-primary truncate">
              {profile?.full_name || 'Saakshya User'}
            </h4>
            <p className="text-[10px] text-text-muted font-bold tracking-wide uppercase mt-0.5">
              Verified Vault
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-danger hover:bg-danger/5 transition cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
