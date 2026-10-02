import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import {
  User,
  Mail,
  Phone,
  Shield,
  Clock,
  Ticket,
  HardDrive,
  Cpu,
  Monitor,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { tickets } = useTickets();

  const myTickets = tickets.filter((t) => t.createdBy === user?.id);
  const myAssigned = tickets.filter((t) => t.assignedTo === user?.id);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">User Profile & Account</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Corporate workstation credentials, organizational role, and ticket engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-900 text-white font-bold text-2xl mx-auto flex items-center justify-center shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
              {user?.department}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Username: <strong className="text-slate-900 font-mono">{user?.username}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Access Level: <strong className="text-slate-900 capitalize">{user?.role}</strong></span>
            </div>
          </div>
        </div>

        {/* Workstation & Engagement Stats */}
        <div className="md:col-span-2 space-y-6">
          {/* Workstation Asset Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              Assigned Corporate Workstation
            </h3>
            <p className="text-xs text-slate-500 mb-4">Device hardware registry for technical support</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3">
                <HardDrive className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-[11px] text-slate-400">Asset Tag</p>
                  <p className="font-mono font-semibold text-slate-800">LT-MAC-2026-084</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3">
                <Cpu className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-[11px] text-slate-400">Device Spec</p>
                  <p className="font-semibold text-slate-800">Apple M3 Pro · 36GB RAM</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-[11px] text-slate-400">OS Build</p>
                  <p className="font-semibold text-slate-800">macOS 14.6 Sonoma</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-[11px] text-slate-400">Compliance</p>
                  <p className="font-semibold text-emerald-700">MDM Active · Encrypted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Activity Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-purple-600" />
              Ticket Activity History
            </h3>
            <p className="text-xs text-slate-500 mb-4">Total requests handled under this profile</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <p className="text-2xl font-bold text-slate-900">{myTickets.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Tickets Submitted by You</p>
              </div>

              {user?.role === 'engineer' || user?.role === 'admin' ? (
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <p className="text-2xl font-bold text-emerald-600">{myAssigned.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tickets Assigned to You</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <p className="text-2xl font-bold text-emerald-600">
                    {myTickets.filter((t) => t.status === 'Resolved').length}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Tickets Successfully Resolved</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
