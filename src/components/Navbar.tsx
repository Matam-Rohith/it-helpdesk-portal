import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Shield, Wrench, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onOpenNewTicket?: () => void;
  onOpenSearch?: () => void;
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewTicket, title = 'IT Help Desk Portal' }) => {
  const { user } = useAuth();

  const getRoleIcon = () => {
    if (user?.role === 'admin') return <Shield className="w-3.5 h-3.5 text-purple-600" />;
    if (user?.role === 'engineer') return <Wrench className="w-3.5 h-3.5 text-emerald-600" />;
    return <UserIcon className="w-3.5 h-3.5 text-blue-600" />;
  };

  const getRoleBadgeStyle = () => {
    if (user?.role === 'admin') return 'bg-purple-50 text-purple-700 border-purple-200';
    if (user?.role === 'engineer') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">{title}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-[11px] text-slate-500 font-mono">v2.4 LTS</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onOpenNewTicket && (
          <button
            onClick={onOpenNewTicket}
            className="btn-primary text-xs py-2 px-3 sm:px-4 flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Ticket</span>
            <span className="sm:hidden">Create</span>
          </button>
        )}

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200 sm:pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded border ${getRoleBadgeStyle()}`}
              >
                {getRoleIcon()}
                <span className="capitalize">{user?.role}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
