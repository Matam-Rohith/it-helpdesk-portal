import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { Mail, Phone, Building, Shield, Wrench, User as UserIcon, Search } from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await api.users.list();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users directory:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRoleIcon = (role: string) => {
    if (role === 'admin') return <Shield className="w-3.5 h-3.5 text-purple-600" />;
    if (role === 'engineer') return <Wrench className="w-3.5 h-3.5 text-emerald-600" />;
    return <UserIcon className="w-3.5 h-3.5 text-blue-600" />;
  };

  const getRoleBadgeStyle = (role: string) => {
    if (role === 'admin') return 'bg-purple-50 text-purple-700 border-purple-200';
    if (role === 'engineer') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Staff & IT Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal contacts, technical support engineers, and systems administrators
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, department, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['All', 'engineer', 'admin', 'employee'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                roleFilter === r
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'All' ? 'All Roles' : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading directory contacts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 leading-tight">{u.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border mt-1 capitalize ${getRoleBadgeStyle(
                        u.role
                      )}`}
                    >
                      {getRoleIcon(u.role)}
                      {u.role === 'admin'
                        ? 'Administrator'
                        : u.role === 'engineer'
                        ? 'Support Engineer'
                        : 'Staff Employee'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{u.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <a href={`mailto:${u.email}`} className="text-blue-600 hover:underline truncate">
                    {u.email}
                  </a>
                </div>
                {u.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{u.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
