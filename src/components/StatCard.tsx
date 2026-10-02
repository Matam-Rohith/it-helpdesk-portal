import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  color?: 'blue' | 'yellow' | 'orange' | 'green' | 'purple' | 'slate';
  badge?: string;
  onClick?: () => void;
}

const colorMap = {
  blue: { iconBg: 'bg-blue-50 text-blue-600 border-blue-100', text: 'text-blue-900' },
  yellow: { iconBg: 'bg-amber-50 text-amber-600 border-amber-100', text: 'text-amber-900' },
  orange: { iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100', text: 'text-indigo-900' },
  green: { iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100', text: 'text-emerald-900' },
  purple: { iconBg: 'bg-purple-50 text-purple-600 border-purple-100', text: 'text-purple-900' },
  slate: { iconBg: 'bg-slate-100 text-slate-600 border-slate-200', text: 'text-slate-900' },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'slate',
  badge,
  onClick,
}) => {
  const c = colorMap[color] || colorMap.slate;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {badge && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg border ${c.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
