import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import Sidebar from '../components/Sidebar';
import TicketTable from '../components/TicketTable';
import StatCard from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { USERS } from '../data/sampleData';
import { BarChart3, CheckCircle, Clock, AlertCircle, UserCheck, User, Mail, Building, Shield } from 'lucide-react';
import { Ticket, TicketStatus } from '../types';

type ActiveTab = 'dashboard' | 'tickets' | 'profile';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tickets, updateTicket } = useTickets();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const engineers = USERS.filter((u) => u.role === 'engineer');

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    assigned: tickets.filter((t) => t.status === 'Assigned').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length,
  };

  const filtered = tickets.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.createdByName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAssign = (ticket: Ticket, engineerId: string) => {
    const eng = engineers.find((e) => e.id === engineerId);
    if (eng) {
      updateTicket(ticket.id, {
        assignedTo: eng.id,
        assignedToName: eng.name,
        status: 'Assigned',
      });
    }
  };

  const handleStatusChange = (ticket: Ticket, status: TicketStatus) => {
    updateTicket(ticket.id, { status });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Overview of all support tickets</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Total" value={stats.total} icon={BarChart3} color="blue" />
                <StatCard title="Open" value={stats.open} icon={AlertCircle} color="yellow" />
                <StatCard title="Assigned" value={stats.assigned} icon={UserCheck} color="purple" />
                <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="orange" />
                <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="green" />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900">Recent Tickets</h2>
                </div>
                <TicketTable
                  tickets={tickets.slice(0, 5)}
                  onSelect={setSelectedTicket}
                  renderActions={(ticket) => (
                    <select
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={ticket.assignedTo || ''}
                      onChange={(e) => handleAssign(ticket, e.target.value)}
                    >
                      <option value="">Assign to...</option>
                      {engineers.map((e) => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-5">
              <h1 className="text-xl font-bold text-gray-900">All Tickets</h1>
              <div className="flex gap-3 flex-wrap">
                <input
                  className="input-field max-w-xs"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="input-field max-w-[160px]"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {['All', 'Open', 'Assigned', 'In Progress', 'Resolved'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <TicketTable
                  tickets={filtered}
                  onSelect={setSelectedTicket}
                  renderActions={(ticket) => (
                    <div className="flex items-center gap-2">
                      <select
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={ticket.assignedTo || ''}
                        onChange={(e) => handleAssign(ticket, e.target.value)}
                      >
                        <option value="">Assign...</option>
                        {engineers.map((e) => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
                      <select
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket, e.target.value as TicketStatus)}
                      >
                        {['Open', 'Assigned', 'In Progress', 'Resolved'].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-lg">
              <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Profile</h1>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{user?.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Administrator</span>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Username:</span>
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium">{user?.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Access Level:</span>
                    <span className="font-medium">Full Admin Access</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-mono text-xs text-blue-600 font-semibold">{selectedTicket.id}</span>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600">&#x2715;</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <h3 className="font-semibold text-gray-900">{selectedTicket.title}</h3>
              <p className="text-sm text-gray-600">{selectedTicket.description}</p>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selectedTicket.status} />
                <PriorityBadge priority={selectedTicket.priority} />
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{selectedTicket.category}</span>
              </div>
              <p className="text-xs text-gray-500">Submitted by: <span className="font-medium">{selectedTicket.createdByName}</span></p>
              {selectedTicket.assignedToName && (
                <p className="text-xs text-gray-500">Assigned to: <span className="font-medium">{selectedTicket.assignedToName}</span></p>
              )}
              <div className="flex gap-2 pt-2">
                <select
                  className="input-field flex-1 text-xs"
                  value={selectedTicket.assignedTo || ''}
                  onChange={(e) => { handleAssign(selectedTicket, e.target.value); setSelectedTicket(null); }}
                >
                  <option value="">Assign to engineer...</option>
                  {engineers.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                <select
                  className="input-field flex-1 text-xs"
                  value={selectedTicket.status}
                  onChange={(e) => { handleStatusChange(selectedTicket, e.target.value as TicketStatus); setSelectedTicket(null); }}
                >
                  {['Open', 'Assigned', 'In Progress', 'Resolved'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
