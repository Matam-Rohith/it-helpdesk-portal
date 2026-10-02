import React from 'react';
import { TicketStatus, TicketPriority, TicketCategory } from '../types';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

interface CategoryBadgeProps {
  category: TicketCategory;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const styles: Record<TicketStatus, { bg: string; dot: string; text: string }> = {
    'Open': {
      bg: 'bg-sky-50 border-sky-200/80',
      dot: 'bg-sky-500',
      text: 'text-sky-800',
    },
    'Assigned': {
      bg: 'bg-amber-50 border-amber-200/80',
      dot: 'bg-amber-500',
      text: 'text-amber-800',
    },
    'In Progress': {
      bg: 'bg-indigo-50 border-indigo-200/80',
      dot: 'bg-indigo-500',
      text: 'text-indigo-800',
    },
    'Resolved': {
      bg: 'bg-emerald-50 border-emerald-200/80',
      dot: 'bg-emerald-500',
      text: 'text-emerald-800',
    },
  };

  const current = styles[status] || styles['Open'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg} ${current.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const styles: Record<TicketPriority, { bg: string; text: string; border: string }> = {
    'Low': {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
    },
    'Medium': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    'High': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    'Urgent': {
      bg: 'bg-rose-50',
      text: 'text-rose-700 font-semibold',
      border: 'border-rose-300',
    },
  };

  const current = styles[priority] || styles['Medium'];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      {priority}
    </span>
  );
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-600 bg-slate-100 border border-slate-200 font-medium ${className}`}
    >
      {category}
    </span>
  );
};
