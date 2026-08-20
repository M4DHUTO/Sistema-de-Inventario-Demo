import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export function ProductModal({ isOpen, onClose, onSave, productToEdit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    stock: '',
    price: '',
    minStock: '15',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || CATEGORIES[0],
        stock: String(productToEdit.stock ?? ''),
        price: String(productToEdit.price ?? ''),
        minStock: String(productToEdit.minStock ?? '15'),
      });
    } else {
      setFormData({
        name: '',
        category: CATEGORIES[0],
        stock: '',
        price: '',
        minStock: '15',
      });
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio.';
    }

    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'La cantidad debe ser un entero mayor o igual a 0.';
    }

    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'El precio unitario debe ser mayor a $ 0 COP.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave(formData);
  };

  const isEdit = Boolean(productToEdit);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white border border-[#E5E7EB] rounded-md shadow-sm max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h2 id="modal-title" className="text-base font-semibold text-primary">
            {isEdit ? `Editar ${productToEdit.id}` : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/25 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nombre del Producto */}
          <div>
            <label className="block text-[12px] font-medium text-primary mb-1">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej. Producto 19"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              className={`w-full px-3 py-1.5 text-xs rounded-md border bg-white text-primary transition-all duration-150 focus:outline-none ${
                errors.name
                  ? 'border-red-500 ring-1 ring-red-500/20'
                  : 'border-zinc-300 hover:border-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25'
              } disabled:opacity-50 disabled:bg-zinc-50 disabled:cursor-not-allowed`}
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-[12px] font-medium text-primary mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              disabled={isLoading}
              className="w-full px-3 py-1.5 text-xs rounded-md border border-zinc-300 bg-white text-primary hover:border-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25 focus:outline-none transition-all duration-150 disabled:opacity-50 disabled:bg-zinc-50 disabled:cursor-not-allowed"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock y Precio Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Cantidad de Stock */}
            <div>
              <label className="block text-[12px] font-medium text-primary mb-1">
                Cantidad en Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="100"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                disabled={isLoading}
                className={`w-full px-3 py-1.5 text-xs tabular-nums rounded-md border bg-white text-primary transition-all duration-150 focus:outline-none ${
                  errors.stock
                    ? 'border-red-500 ring-1 ring-red-500/20'
                    : 'border-zinc-300 hover:border-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25'
                } disabled:opacity-50 disabled:bg-zinc-50 disabled:cursor-not-allowed`}
              />
              {errors.stock && (
                <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.stock}</p>
              )}
            </div>

            {/* Precio Unitario (COP) */}
            <div>
              <label className="block text-[12px] font-medium text-primary mb-1">
                Precio Unitario (COP) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="47500"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                disabled={isLoading}
                className={`w-full px-3 py-1.5 text-xs tabular-nums rounded-md border bg-white text-primary transition-all duration-150 focus:outline-none ${
                  errors.price
                    ? 'border-red-500 ring-1 ring-red-500/20'
                    : 'border-zinc-300 hover:border-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25'
                } disabled:opacity-50 disabled:bg-zinc-50 disabled:cursor-not-allowed`}
              />
              {errors.price && (
                <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
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
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
