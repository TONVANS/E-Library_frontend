import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  subtitle?: string;
  colorVariant?: 'blue' | 'gold' | 'green' | 'purple';
}

export function StatsCard({
  title,
  value,
  icon,
  subtitle,
  colorVariant = 'blue',
}: StatsCardProps) {
  const colorMap = {
    blue: {
      bg: 'from-blue-600 to-indigo-700',
      iconBg: 'bg-blue-50 text-[#003d9b]',
      pill: 'text-blue-700 bg-blue-50',
    },
    gold: {
      bg: 'from-amber-500 to-yellow-600',
      iconBg: 'bg-amber-50 text-amber-700',
      pill: 'text-amber-800 bg-amber-50',
    },
    green: {
      bg: 'from-emerald-500 to-teal-700',
      iconBg: 'bg-emerald-50 text-emerald-700',
      pill: 'text-emerald-800 bg-emerald-50',
    },
    purple: {
      bg: 'from-purple-600 to-indigo-800',
      iconBg: 'bg-purple-50 text-purple-700',
      pill: 'text-purple-800 bg-purple-50',
    },
  };

  const style = colorMap[colorVariant] || colorMap.blue;

  return (
    <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-[#737685] uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-[#191c1d] tracking-tight">{value}</h3>
        {subtitle && (
          <p className="text-xs text-[#434654] mt-1 font-medium flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center shadow-inner`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
    </div>
  );
}
