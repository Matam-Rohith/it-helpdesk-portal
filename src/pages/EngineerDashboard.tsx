import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import Sidebar from '../components/Sidebar';
import TicketTable from '../components/TicketTable';
import StatCard from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { CheckCircle, Clock, UserCheck, User, Mail, Building, Wrench } from 'lucide-react';
import { Ticket, TicketStatus } from '../types';

type ActiveTab = 'dashboard' | 'tickets' | 'profile';

const EngineerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getTicketsByEngineer, updateTicket } = useTickets();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const myTickets = getTicketsByEngineer(user!.id);
  const stats = {
    assigned: myTickets.filter((t) => t.status === 'Assigned').length,
    inProgress: myTickets.filter((t) => t.status === 'In Progress').length,
    resolved: myTickets.filter((t) => t.status === 'Resolved').length,
  };

  const filtered = myTickets.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const nextStatus = (current: TicketStatus): TicketStatus | null => {
    if (current === 'Assigned') return 'In Progress';
    if (current === 'In Progress') return 'Resolved';
    return null;
  };

  const handleProgress = (ticket: Ticket) => {
    const next = nextStatus(ticket.status);
    if (next) updateTicket(ticket.id, { status: next });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Engineer Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your assigned tickets</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Assigned" value={stats.assigned} icon={UserCheck} color="yellow" />
                <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="orange" />
                <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="green" />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900">My Assigned Tickets</h2>
                </div>
                <TicketTable
                  tickets={myTickets.slice(0, 5)}
                  onSelect={setSelectedTicket}
                  renderActions={(ticket) => {
                    const next = nextStatus(ticket.status);
                    if (!next) return <span className="text-xs text-green-600 font-medium">Resolved</span>;
                    return (
                      <button
                        onClick={() => handleProgress(ticket)}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark {next}
                      </button>
                    );
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-5">
              <h1 className="text-xl font-bold text-gray-900">Assigned Tickets</h1>
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
                  {['All', 'Assigned', 'In Progress', 'Resolved'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <TicketTable
                  tickets={filtered}
                  onSelect={setSelectedTicket}
                  renderActions={(ticket) => {
                    const next = nextStatus(ticket.status);
                    if (!next) return <span className="text-xs text-green-600 font-medium">Resolved</span>;
                    return (
                      <button
                        onClick={() => handleProgress(ticket)}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark {next}
                      </button>
                    );
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-lg">
              <h1 className="text-xl font-bold text-gray-900 mb-6">Engineer Profile</h1>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{user?.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Support Engineer</span>
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
                    <Wrench className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Tickets Assigned:</span>
                    <span className="font-medium">{myTickets.length}</span>
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
              {nextStatus(selectedTicket.status) && (
                <button
                  onClick={() => { handleProgress(selectedTicket); setSelectedTicket(null); }}
                  className="btn-primary w-full"
                >
                  Mark as {nextStatus(selectedTicket.status)}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineerDashboard;
