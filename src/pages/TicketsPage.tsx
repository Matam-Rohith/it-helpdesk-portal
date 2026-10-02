import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import TicketTable from '../components/TicketTable';
import { Ticket } from '../types';
import { Search, Plus, RotateCcw } from 'lucide-react';

interface OutletContextType {
  onSelectTicket: (ticket: Ticket) => void;
  onOpenCreate: () => void;
}

export const TicketsPage: React.FC = () => {
  const { user } = useAuth();
  const { tickets, engineers } = useTickets();
  const { onSelectTicket, onOpenCreate } = useOutletContext<OutletContextType>();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'mine'>('all');

  const isStaff = user?.role === 'admin' || user?.role === 'engineer';

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setAssigneeFilter('All');
    setScopeFilter('all');
  };

  const hasActiveFilters =
    search !== '' ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    categoryFilter !== 'All' ||
    assigneeFilter !== 'All' ||
    scopeFilter !== 'all';

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Scope filter (mine vs all)
      if (scopeFilter === 'mine') {
        if (user?.role === 'employee' && ticket.createdBy !== user.id) return false;
        if (user?.role === 'engineer' && ticket.assignedTo !== user.id) return false;
      }

      // Status
      if (statusFilter !== 'All' && ticket.status !== statusFilter) return false;

      // Priority
      if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) return false;

      // Category
      if (categoryFilter !== 'All' && ticket.category !== categoryFilter) return false;

      // Assignee
      if (assigneeFilter === 'unassigned' && ticket.assignedTo) return false;
      if (assigneeFilter !== 'All' && assigneeFilter !== 'unassigned' && ticket.assignedTo !== assigneeFilter) {
        return false;
      }

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          ticket.id.toLowerCase().includes(q) ||
          ticket.title.toLowerCase().includes(q) ||
          ticket.description.toLowerCase().includes(q) ||
          ticket.createdByName.toLowerCase().includes(q) ||
          (ticket.assignedToName && ticket.assignedToName.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter, assigneeFilter, scopeFilter, user]);

  const statusCounts = useMemo(() => {
    return {
      All: tickets.length,
      Open: tickets.filter((t) => t.status === 'Open').length,
      Assigned: tickets.filter((t) => t.status === 'Assigned').length,
      'In Progress': tickets.filter((t) => t.status === 'In Progress').length,
      Resolved: tickets.filter((t) => t.status === 'Resolved').length,
    };
  }, [tickets]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Support Ticket Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse, filter, and track technical support cases across all departments
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        {/* Status Pill Filters */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', 'Open', 'Assigned', 'In Progress', 'Resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {st} <span className="opacity-70 ml-1 text-[11px]">({statusCounts[st] || 0})</span>
              </button>
            ))}
          </div>

          {/* Scope Toggle if Staff */}
          {isStaff && (
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setScopeFilter('all')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  scopeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                All Organization
              </button>
              <button
                onClick={() => setScopeFilter('mine')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  scopeFilter === 'mine' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                My Queue
              </button>
            </div>
          )}
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, keyword, requester..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field text-xs text-slate-700 font-medium"
            >
              <option value="All">Category: All</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Email">Email</option>
              <option value="Printer">Printer</option>
              <option value="Access & Security">Access & Security</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field text-xs text-slate-700 font-medium"
            >
              <option value="All">Priority: All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center gap-2">
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="input-field text-xs text-slate-700 font-medium flex-1"
            >
              <option value="All">Assignee: All</option>
              <option value="unassigned">Unassigned Only</option>
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {eng.name}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                title="Reset all filters"
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <TicketTable
          tickets={filteredTickets}
          onSelect={onSelectTicket}
          renderActions={(ticket) => {
            if (isStaff && ticket.status !== 'Resolved') {
              return (
                <button
                  onClick={() => onSelectTicket(ticket)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                >
                  Manage →
                </button>
              );
            }
            return (
              <button
                onClick={() => onSelectTicket(ticket)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                View →
              </button>
            );
          }}
        />
      </div>
    </div>
  );
};

export default TicketsPage;
