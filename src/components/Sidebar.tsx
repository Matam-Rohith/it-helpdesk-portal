import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  Users,
  User,
  LogOut,
  Menu,
  X,
  Headphones,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tickets', label: 'Ticket Queue', icon: Ticket },
    { to: '/directory', label: 'Staff Directory', icon: Users },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  const roleLabel =
    user?.role === 'admin'
      ? 'Administrator'
      : user?.role === 'engineer'
      ? 'Support Engineer'
      : 'Employee';

  const roleBadgeColor =
    user?.role === 'admin'
      ? 'bg-purple-100 text-purple-800'
      : user?.role === 'engineer'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-blue-100 text-blue-800';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
          <Headphones className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight text-white block">IT Help Desk</span>
          <span className="text-[10px] text-slate-400 block font-mono">Service Portal</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Navigation
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Help box */}
      <div className="px-4 py-3 mx-3 mb-4 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
          <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />
          <span>Internal Support</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Urgent outage? Contact NOC hot-desk at ext. 4400.
        </p>
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${roleBadgeColor}`}>
              {roleLabel}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top trigger */}
      <div className="lg:hidden fixed top-3 left-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-64 h-full bg-slate-900 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:block w-60 h-screen sticky top-0 flex-shrink-0 z-20">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
