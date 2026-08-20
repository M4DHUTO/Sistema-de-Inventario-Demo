import React from 'react';
import { formatRelativeTime } from '../utils/formatDate';
import { History, UserCheck, PlusCircle, RefreshCw, Trash2, AlertTriangle, FileSpreadsheet } from 'lucide-react';

export function ActivityLog({ logs }) {
  const getActionIcon = (type) => {
    switch (type) {
      case 'CREATE':
        return <PlusCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'UPDATE':
      case 'STOCK_IN':
        return <RefreshCw className="w-3.5 h-3.5 text-zinc-500 shrink-0" />;
      case 'DELETE':
        return <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />;
      case 'ALERT':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'EXPORT':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-md p-4 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-zinc-500 stroke-[1.75]" />
          <h3 className="text-sm font-semibold text-primary">
            Panel de trazabilidad
          </h3>
        </div>
        <span className="text-[12px] text-secondary tabular-nums">
          Últimas transacciones
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[260px]">
        {(!logs || logs.length === 0) ? (
          <div className="py-8 text-center text-xs text-secondary">
            No hay registros de actividad recientes.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5 text-xs py-1.5 border-b border-zinc-100 last:border-0"
            >
              <div className="mt-0.5 p-1 rounded bg-zinc-50 border border-zinc-200">
                {getActionIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-medium text-primary truncate">
                    {log.user}
                  </span>
                  <span className="text-[11px] text-secondary tabular-nums shrink-0">
                    {formatRelativeTime(log.timestamp)}
                  </span>
                </div>
                <p className="text-secondary leading-snug">
                  {log.action} <span className="text-primary font-medium">{log.details}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
