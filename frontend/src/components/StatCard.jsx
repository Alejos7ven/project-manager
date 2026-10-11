import React from 'react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'indigo',
  subtitle,
}) => {
  const colorSchemes = {
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
      badge: 'bg-indigo-50/80 text-indigo-700',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      badge: 'bg-emerald-50/80 text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      badge: 'bg-amber-50/80 text-amber-700',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      badge: 'bg-blue-50/80 text-blue-700',
    },
  };

  const currentTheme = colorSchemes[color] || colorSchemes.indigo;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value !== undefined && value !== null ? value : '-'}
          </h4>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${currentTheme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
