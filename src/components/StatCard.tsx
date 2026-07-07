import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'orange' | 'green' | 'purple';
  trend?: string;
}

const colorMap = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'bg-yellow-100' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
  green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  const colors = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${colors.text}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
