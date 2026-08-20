import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-md border shadow-sm transition-all duration-150 bg-white ${
              isError
                ? 'border-red-200 text-red-900'
                : isInfo
                ? 'border-blue-200 text-blue-900'
                : 'border-emerald-200 text-emerald-900'
            }`}
            role="alert"
          >
            {isError ? (
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            ) : isInfo ? (
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            )}

            <div className="flex-1 text-xs leading-relaxed font-medium">
              {toast.title && <div className="font-semibold text-xs mb-0.5">{toast.title}</div>}
              <div>{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-600 p-0.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400"
              aria-label="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
