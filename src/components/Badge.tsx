import React from 'react';
import { TicketStatus, TicketPriority } from '../types';

interface StatusBadgeProps {
  status: TicketStatus;
}

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const map: Record<TicketStatus, string> = {
    'Open': 'bg-blue-100 text-blue-700 border-blue-200',
    'Assigned': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'In Progress': 'bg-orange-100 text-orange-700 border-orange-200',
    'Resolved': 'bg-green-100 text-green-700 border-green-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}>
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const map: Record<TicketPriority, string> = {
    'Low': 'bg-gray-100 text-gray-600 border-gray-200',
    'Medium': 'bg-purple-100 text-purple-700 border-purple-200',
    'High': 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[priority]}`}>
      {priority}
    </span>
  );
};
