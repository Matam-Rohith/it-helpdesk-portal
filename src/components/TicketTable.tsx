import React, { useState } from 'react';
import { Ticket } from '../types';
import { StatusBadge, PriorityBadge, CategoryBadge } from './Badge';
import { Calendar, User, ArrowUpDown, ChevronUp, ChevronDown, Download, Inbox } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  onSelect?: (ticket: Ticket) => void;
  renderActions?: (ticket: Ticket) => React.ReactNode;
}

type SortField = 'id' | 'title' | 'category' | 'priority' | 'status' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const TicketTable: React.FC<TicketTableProps> = ({ tickets, onSelect, renderActions }) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    let valA: any = a[sortField];
    let valB: any = b[sortField];

    if (sortField === 'priority') {
      const pWeights: Record<string, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      valA = pWeights[a.priority] || 0;
      valB = pWeights[b.priority] || 0;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const exportCSV = () => {
    if (tickets.length === 0) return;
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Requester', 'Assignee', 'Created', 'Updated'];
    const rows = sortedTickets.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.status,
      `"${t.createdByName}"`,
      `"${t.assignedToName || 'Unassigned'}"`,
      t.createdAt,
      t.updatedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tickets_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Inbox className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No tickets found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No records match the current filter criteria. Try adjusting the search query or status filter.
        </p>
      </div>
    );
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-blue-600" />
    );
  };

  return (
    <div>
      {/* Table toolbar */}
      <div className="px-4 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Showing <strong className="text-slate-800">{tickets.length}</strong> tickets</span>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Download className="w-3 h-3 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/40 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th
                onClick={() => handleSort('id')}
                className="px-4 py-3 cursor-pointer group hover:bg-slate-100/60 transition-colors w-24"
              >
                <div className="flex items-center gap-1.5">
                  ID {renderSortIcon('id')}
                </div>
              </th>
              <th
                onClick={() => handleSort('title')}
                className="px-4 py-3 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  Subject {renderSortIcon('title')}
                </div>
              </th>
              <th
                onClick={() => handleSort('category')}
                className="px-4 py-3 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  Category {renderSortIcon('category')}
                </div>
              </th>
              <th
                onClick={() => handleSort('priority')}
                className="px-4 py-3 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  Priority {renderSortIcon('priority')}
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-4 py-3 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  Status {renderSortIcon('status')}
                </div>
              </th>
              <th
                onClick={() => handleSort('createdAt')}
                className="px-4 py-3 cursor-pointer group hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  Created {renderSortIcon('createdAt')}
                </div>
              </th>
              {renderActions && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => onSelect?.(ticket)}
                className={`hover:bg-slate-50/80 transition-colors group ${
                  onSelect ? 'cursor-pointer' : ''
                }`}
              >
                <td className="px-4 py-3.5">
                  <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50/70 border border-blue-200/50 px-1.5 py-0.5 rounded">
                    {ticket.id}
                  </span>
                </td>
                <td className="px-4 py-3.5 max-w-md">
                  <div>
                    <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {ticket.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {ticket.createdByName}
                      </span>
                      {ticket.assignedToName && (
                        <span>
                          → <strong className="text-slate-600 font-normal">{ticket.assignedToName}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <CategoryBadge category={ticket.category} />
                </td>
                <td className="px-4 py-3.5">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </td>
                {renderActions && (
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    {renderActions(ticket)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Below md breakpoint) */}
      <div className="md:hidden divide-y divide-slate-100">
        {sortedTickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelect?.(ticket)}
            className="p-4 hover:bg-slate-50/80 active:bg-slate-100 transition-colors cursor-pointer space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/50">
                {ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
            </div>

            <p className="font-medium text-slate-900 text-sm">{ticket.title}</p>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <PriorityBadge priority={ticket.priority} />
              <CategoryBadge category={ticket.category} />
              <span className="text-slate-400 text-xs ml-auto">
                {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
              <span>By {ticket.createdByName}</span>
              {ticket.assignedToName ? (
                <span className="text-slate-700">Assigned: {ticket.assignedToName}</span>
              ) : (
                <span className="text-slate-400 italic">Unassigned</span>
              )}
            </div>

            {renderActions && (
              <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                {renderActions(ticket)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketTable;
