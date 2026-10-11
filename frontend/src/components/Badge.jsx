import React from 'react';

const Badge = ({ status, text, className = '' }) => {
  const displayStatus = (status || '').toLowerCase();

  const styles = {
    // Client statuses
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
    lead: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
    // Project statuses
    pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
  };

  const labels = {
    active: 'Active',
    inactive: 'Inactive',
    lead: 'Lead',
    pending: 'Pending',
    completed: 'Completed',
  };

  const styleClass = styles[displayStatus] || 'bg-slate-100 text-slate-700 border-slate-200';
  const labelText = text || labels[displayStatus] || displayStatus;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70" />
      {labelText}
    </span>
  );
};

export default Badge;
