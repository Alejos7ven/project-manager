import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const Alert = ({
  type = 'info',
  message,
  title,
  onClose,
  className = '',
}) => {
  if (!message) return null;

  const configs = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: AlertCircle,
      iconColor: 'text-rose-500',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
    },
    info: {
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      icon: Info,
      iconColor: 'text-indigo-500',
    },
  };

  const current = configs[type] || configs.info;
  const IconComponent = current.icon;

  return (
    <div
      className={`flex items-start p-3.5 rounded-lg border text-sm transition-all ${current.bg} ${className}`}
      role="alert"
    >
      <IconComponent className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${current.iconColor}`} />
      <div className="flex-1 text-left">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="text-xs sm:text-sm leading-relaxed">{message}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-3 shrink-0 p-1 rounded-md hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
