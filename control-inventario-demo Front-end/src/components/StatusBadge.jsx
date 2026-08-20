import React from 'react';

export function StatusBadge({ stock, minStock = 30 }) {
  let label = 'Óptimo';
  let styles = 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';

  if (stock === 0) {
    label = 'Agotado';
    styles = 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]';
  } else if (stock < minStock) {
    label = 'Stock bajo';
    styles = 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] font-medium border ${styles} whitespace-nowrap`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {label}
    </span>
  );
}
