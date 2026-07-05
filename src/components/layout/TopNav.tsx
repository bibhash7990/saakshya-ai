import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ShieldCheck, Cloud, CloudOff } from 'lucide-react';
import { isSupabaseConfigured } from '@/services/supabase';

interface TopNavProps {
  title?: string;
}

export const TopNav: React.FC<TopNavProps> = ({ title = 'Dashboard' }) => {
  const { user } = useAuth();
  const online = isSupabaseConfigured();

  return (
    <header className="h-16 shrink-0 border-b border-border bg-bg-primary sticky top-0 z-30 flex items-center justify-center w-full">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile only logo since desktop has it in the sidebar */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-glow">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-text-primary capitalize hidden sm:block">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Supabase connection indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-bg-secondary border border-border rounded-full select-none">
            {online ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-success animate-pulse" />
                <span className="text-[10px] font-bold text-text-secondary">Secured Cloud DB</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-accent-500" />
                <span className="text-[10px] font-bold text-text-secondary">Demo Vault Local</span>
              </>
            )}
          </div>

          {/* Encrypted lock indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-primary-400 text-xs font-bold">
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>FIPS Locked</span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default TopNav;
