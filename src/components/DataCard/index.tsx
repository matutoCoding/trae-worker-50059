import { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
};

export default function DataCard({ title, value, icon, subtitle, trend, color = 'blue' }: DataCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg border ${colorMap[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
