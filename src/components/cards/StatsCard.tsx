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
      border: 'hover:border-blue-300',
      iconBg: 'bg-blue-50 text-[#003d9b]',
      pill: 'text-blue-700 bg-blue-50/80',
    },
    gold: {
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-700',
      pill: 'text-amber-800 bg-amber-50/80',
    },
    green: {
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-700',
      pill: 'text-emerald-800 bg-emerald-50/80',
    },
    purple: {
      border: 'hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-700',
      pill: 'text-purple-800 bg-purple-50/80',
    },
  };

  const style = colorMap[colorVariant] || colorMap.blue;

  return (
    <div
      className={`glass-panel p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group ${style.border}`}
    >
      <div className="min-w-0 flex-1 pr-3">
        <p className="text-[11px] font-bold text-[#737685] uppercase tracking-wider mb-1 truncate">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight group-hover:text-[#003d9b] transition-colors">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        {subtitle && (
          <p className="text-xs text-[#434654] mt-1.5 font-medium flex items-center gap-1 truncate">
            {subtitle}
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200`}
      >
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
    </div>
  );
}
