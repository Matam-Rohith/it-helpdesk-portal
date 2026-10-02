import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import StatCard from '../components/StatCard';
import TicketTable from '../components/TicketTable';
import { Ticket, TicketStatus } from '../types';
import {
  BarChart3,
  AlertCircle,
  Clock,
  CheckCircle2,
  UserCheck,
  Plus,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Laptop,
  Wifi,
  KeyRound,
} from 'lucide-react';

interface OutletContextType {
  onSelectTicket: (ticket: Ticket) => void;
  onOpenCreate: () => void;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tickets, stats, engineers, updateTicket } = useTickets();
  const { onSelectTicket, onOpenCreate } = useOutletContext<OutletContextType>();

  const isStaff = user?.role === 'admin' || user?.role === 'engineer';
  const isAdmin = user?.role === 'admin';
  const isEngineer = user?.role === 'engineer';
  const isEmployee = user?.role === 'employee';

  // Role-filtered lists
  const myTickets = tickets.filter((t) => t.createdBy === user?.id);
  const myAssignedTickets = tickets.filter((t) => t.assignedTo === user?.id);
  const unassignedTickets = tickets.filter((t) => t.status === 'Open' && !t.assignedTo);
  const urgentTickets = tickets.filter((t) => (t.priority === 'Urgent' || t.priority === 'High') && t.status !== 'Resolved');

  const handleQuickAssign = async (ticket: Ticket, engineerId: string) => {
    await updateTicket(ticket.id, {
      assignedTo: engineerId,
      status: 'Assigned',
    });
  };

  const handleQuickStatus = async (ticket: Ticket, nextStatus: TicketStatus) => {
    await updateTicket(ticket.id, { status: nextStatus });
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium capitalize">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isEmployee && 'Track and manage your submitted IT requests and workstation inquiries.'}
            {isEngineer && `You have ${myAssignedTickets.filter((t) => t.status !== 'Resolved').length} active tickets assigned to your queue.`}
            {isAdmin && 'Global IT support operations and queue triage dashboard.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/tickets"
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <span>View All Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onOpenCreate}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isEmployee ? (
          <>
            <StatCard
              title="My Requests"
              value={myTickets.length}
              icon={BarChart3}
              color="blue"
              subtitle="All-time submitted"
            />
            <StatCard
              title="Awaiting Triage"
              value={myTickets.filter((t) => t.status === 'Open').length}
              icon={AlertCircle}
              color="yellow"
              subtitle="Received by IT desk"
            />
            <StatCard
              title="In Progress"
              value={myTickets.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').length}
              icon={Clock}
              color="orange"
              subtitle="Technician actively working"
            />
            <StatCard
              title="Resolved"
              value={myTickets.filter((t) => t.status === 'Resolved').length}
              icon={CheckCircle2}
              color="green"
              subtitle="Closed issues"
            />
          </>
        ) : isEngineer ? (
          <>
            <StatCard
              title="Assigned to Me"
              value={myAssignedTickets.filter((t) => t.status !== 'Resolved').length}
              icon={UserCheck}
              color="yellow"
              subtitle="Active ticket queue"
            />
            <StatCard
              title="In Progress"
              value={myAssignedTickets.filter((t) => t.status === 'In Progress').length}
              icon={Clock}
              color="orange"
              subtitle="Currently being investigated"
            />
            <StatCard
              title="Resolved by Me"
              value={myAssignedTickets.filter((t) => t.status === 'Resolved').length}
              icon={CheckCircle2}
              color="green"
              subtitle="Total resolved"
            />
            <StatCard
              title="Unassigned Backlog"
              value={unassignedTickets.length}
              icon={AlertCircle}
              color="blue"
              subtitle="Ready for claim"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Tickets"
              value={stats?.total || tickets.length}
              icon={BarChart3}
              color="blue"
              subtitle="All departments"
            />
            <StatCard
              title="Unassigned / Open"
              value={unassignedTickets.length}
              icon={AlertCircle}
              color="yellow"
              subtitle="Needs technician dispatch"
            />
            <StatCard
              title="In Progress"
              value={stats?.inProgress || 0}
              icon={Clock}
              color="orange"
              subtitle="Active investigation"
            />
            <StatCard
              title="Resolved"
              value={stats?.resolved || 0}
              icon={CheckCircle2}
              color="green"
              subtitle={`Avg. resolution: ${stats?.avgResolutionHours || 2.4}h`}
            />
          </>
        )}
      </div>

      {/* Urgent Ticket Notification Banner if any exist */}
      {urgentTickets.length > 0 && isStaff && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900">
                {urgentTickets.length} High / Urgent Priority Ticket{urgentTickets.length > 1 ? 's' : ''} Requiring Attention
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                Earliest: {urgentTickets[0].title} ({urgentTickets[0].id})
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTicket(urgentTickets[0])}
            className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Review Ticket
          </button>
        </div>
      )}

      {/* Main Role Content */}
      {isEmployee && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">My Recent Requests</h2>
                <p className="text-xs text-slate-500">Tickets you have submitted to IT support</p>
              </div>
              <Link to="/tickets" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                View all ({myTickets.length}) →
              </Link>
            </div>
            <TicketTable tickets={myTickets.slice(0, 5)} onSelect={onSelectTicket} />
          </div>

          {/* Quick IT Self-Service Knowledge Base */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Frequently Asked IT Solutions
            </h3>
            <p className="text-xs text-slate-500 mb-4">Quick checks before submitting a ticket</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1.5">
                  <Wifi className="w-4 h-4 text-blue-600" />
                  <span>Wi-Fi & VPN Setup</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect to <strong>Campus-Secure</strong> using your domain username. Download the WireGuard profile from the company portal.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1.5">
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  <span>Password & MFA Reset</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Locked out? Use self-service password portal or submit a ticket with priority <em>Medium</em> for immediate token reset.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1.5">
                  <Laptop className="w-4 h-4 text-emerald-600" />
                  <span>Hardware Diagnostics</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For docking station and display disconnects, please power-cycle the dock by disconnecting the power barrel for 15 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEngineer && (
        <div className="space-y-6">
          {/* My Queue */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">My Assigned Tickets</h2>
                <p className="text-xs text-slate-500">Tickets awaiting your diagnostic or resolution</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                {myAssignedTickets.filter((t) => t.status !== 'Resolved').length} Active
              </span>
            </div>
            <TicketTable
              tickets={myAssignedTickets}
              onSelect={onSelectTicket}
              renderActions={(ticket) => {
                if (ticket.status === 'Assigned') {
                  return (
                    <button
                      onClick={() => handleQuickStatus(ticket, 'In Progress')}
                      className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium px-2.5 py-1 rounded border border-indigo-200 transition-colors"
                    >
                      Start Work
                    </button>
                  );
                }
                if (ticket.status === 'In Progress') {
                  return (
                    <button
                      onClick={() => onSelectTicket(ticket)}
                      className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium px-2.5 py-1 rounded border border-emerald-200 transition-colors"
                    >
                      Resolve...
                    </button>
                  );
                }
                return <span className="text-xs text-slate-400 font-medium">Closed</span>;
              }}
            />
          </div>

          {/* Unassigned Pool */}
          {unassignedTickets.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Unassigned Backlog Pool</h2>
                  <p className="text-xs text-slate-500">Tickets waiting to be claimed by support engineers</p>
                </div>
              </div>
              <TicketTable
                tickets={unassignedTickets}
                onSelect={onSelectTicket}
                renderActions={(ticket) => (
                  <button
                    onClick={() => handleQuickAssign(ticket, user!.id)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-2.5 py-1 rounded shadow-sm transition-colors"
                  >
                    Claim Ticket
                  </button>
                )}
              />
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="space-y-6">
          {/* Triage Needed */}
          {unassignedTickets.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/40">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Unassigned Tickets Requiring Dispatch ({unassignedTickets.length})
                  </h2>
                  <p className="text-xs text-slate-500">Assign an engineer to begin troubleshooting</p>
                </div>
              </div>
              <TicketTable
                tickets={unassignedTickets}
                onSelect={onSelectTicket}
                renderActions={(ticket) => (
                  <select
                    className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    value={ticket.assignedTo || ''}
                    onChange={(e) => handleQuickAssign(ticket, e.target.value)}
                  >
                    <option value="">Assign to...</option>
                    {engineers.map((eng) => (
                      <option key={eng.id} value={eng.id}>
                        {eng.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          )}

          {/* Category & Priority Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Tickets by Category</h3>
              <p className="text-xs text-slate-500 mb-4">Volume breakdown across IT departments</p>

              <div className="space-y-2.5">
                {Object.entries(stats?.byCategory || {}).map(([cat, count]) => {
                  const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{cat}</span>
                        <span className="text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Tickets by Priority</h3>
              <p className="text-xs text-slate-500 mb-4">Urgency levels across open and resolved queue</p>

              <div className="space-y-2.5">
                {Object.entries(stats?.byPriority || {}).map(([prio, count]) => {
                  const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
                  const barColor =
                    prio === 'Urgent'
                      ? 'bg-rose-600'
                      : prio === 'High'
                      ? 'bg-amber-500'
                      : prio === 'Medium'
                      ? 'bg-blue-500'
                      : 'bg-slate-400';

                  return (
                    <div key={prio} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{prio}</span>
                        <span className="text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Global Queue */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Recent Service Activity</h2>
                <p className="text-xs text-slate-500">Latest tickets filed across the organization</p>
              </div>
              <Link to="/tickets" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                View all tickets →
              </Link>
            </div>
            <TicketTable tickets={tickets.slice(0, 8)} onSelect={onSelectTicket} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
