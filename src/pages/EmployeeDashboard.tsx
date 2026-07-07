import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import Sidebar from '../components/Sidebar';
import TicketTable from '../components/TicketTable';
import TicketForm from '../components/TicketForm';
import StatCard from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { Ticket, Plus, CheckCircle, Clock, AlertCircle, BarChart3, User, Mail, Building } from 'lucide-react';
import { useAuth as useAuthHook } from '../context/AuthContext';

type ActiveTab = 'dashboard' | 'tickets' | 'profile';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getTicketsByUser } = useTickets();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<import('../types').Ticket | null>(null);

  const myTickets = getTicketsByUser(user!.id);
  const stats = {
    total: myTickets.length,
    open: myTickets.filter((t) => t.status === 'Open').length,
    inProgress: myTickets.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').length,
    resolved: myTickets.filter((t) => t.status === 'Resolved').length,
  };

  const filtered = myTickets.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Track your support tickets below</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Ticket
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Tickets" value={stats.total} icon={BarChart3} color="blue" />
                <StatCard title="Open" value={stats.open} icon={AlertCircle} color="yellow" />
                <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="orange" />
                <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="green" />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900">Recent Tickets</h2>
                </div>
                <TicketTable tickets={myTickets.slice(0, 5)} onSelect={setSelectedTicket} />
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">My Tickets</h1>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Ticket
                </button>
              </div>
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
                <TicketTable tickets={filtered} onSelect={setSelectedTicket} />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-lg">
              <h1 className="text-xl font-bold text-gray-900 mb-6">My Profile</h1>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{user?.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Employee</span>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Username:</span>
                    <span className="font-medium text-gray-800">{user?.username}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-800">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium text-gray-800">{user?.department}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Total Tickets Submitted: <span className="font-semibold text-gray-800">{myTickets.length}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showForm && <TicketForm onClose={() => setShowForm(false)} />}

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
              {selectedTicket.assignedToName && (
                <p className="text-xs text-gray-500">Assigned to: <span className="font-medium">{selectedTicket.assignedToName}</span></p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
