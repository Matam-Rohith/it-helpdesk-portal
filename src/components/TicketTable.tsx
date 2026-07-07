import React from 'react';
import { Ticket } from '../types';
import { StatusBadge, PriorityBadge } from './Badge';
import { Calendar, User, Tag } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  onSelect?: (ticket: Ticket) => void;
  showActions?: boolean;
  renderActions?: (ticket: Ticket) => React.ReactNode;
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets, onSelect, renderActions }) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">No tickets found</h3>
        <p className="text-sm text-gray-500">There are no tickets matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
            {renderActions && <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className={`hover:bg-gray-50 transition-colors ${onSelect ? 'cursor-pointer' : ''}`}
              onClick={() => onSelect?.(ticket)}
            >
              <td className="px-4 py-3">
                <span className="font-mono text-xs text-blue-600 font-medium">{ticket.id}</span>
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900 line-clamp-1">{ticket.title}</p>
                  {ticket.assignedToName && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3" /> {ticket.assignedToName}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{ticket.category}</span>
              </td>
              <td className="px-4 py-3"><PriorityBadge priority={ticket.priority} /></td>
              <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
              <td className="px-4 py-3">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </td>
              {renderActions && (
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  {renderActions(ticket)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
