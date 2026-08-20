import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export function DeleteModal({ isOpen, onClose, onConfirm, product, isLoading }) {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white border border-[#E5E7EB] rounded-md shadow-sm max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-red-50 text-red-600 shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h3 id="delete-modal-title" className="text-sm font-semibold text-primary">
              Eliminar producto
            </h3>
            <p className="text-xs text-secondary mt-1 leading-relaxed">
              ¿Estás seguro de que deseas eliminar{' '}
              <strong className="text-primary font-medium">{product.name} ({product.id})</strong>? Esta acción no se puede deshacer en la base de datos.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Confirmar eliminación
          </button>
        </div>
      </div>
    </div>
  );
}
