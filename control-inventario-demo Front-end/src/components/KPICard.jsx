import React from 'react';

export function KPICard({ title, value, detail, icon: Icon, isDominant = false, highlightColor }) {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-md p-4 shadow-sm flex flex-col justify-between transition-all duration-150 ${
        isDominant ? 'ring-1 ring-accent/20 bg-gradient-to-b from-white to-zinc-50/50' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[12px] font-medium text-secondary uppercase tracking-wider">
          {title}
        </span>
        {Icon && <Icon className="w-4 h-4 text-zinc-400 stroke-[1.75]" />}
      </div>

      <div className="space-y-1">
        <div className={`text-2xl font-semibold tabular-nums tracking-tight ${highlightColor || 'text-primary'}`}>
          {value}
        </div>
        {detail && (
          <p className="text-[12px] text-secondary font-normal truncate">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}
