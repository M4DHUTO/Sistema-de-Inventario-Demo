import React, { useState, useMemo } from 'react';
import { Search, Filter, FileSpreadsheet, Plus, Edit2, Trash2, XCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORIES } from '../data/mockData';

export function InventoryTable({
  products,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
  onExportCsv,
  isLoading,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter products based on search query, category, and status
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      // Category match
      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;

      // Status match
      let matchesStatus = true;
      if (selectedStatus === 'OPTIMAL') {
        matchesStatus = product.stock >= (product.minStock || 30);
      } else if (selectedStatus === 'LOW') {
        matchesStatus = product.stock > 0 && product.stock < (product.minStock || 30);
      } else if (selectedStatus === 'OUT') {
        matchesStatus = product.stock === 0;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Reset to page 1 whenever filters change
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, safeCurrentPage, itemsPerPage]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-md shadow-sm flex flex-col space-y-4 p-4">
      {/* Barra de Controles: Búsqueda, Filtros y Acciones */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-2 border-b border-zinc-100">
        {/* Filtros e Inputs */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Búsqueda por Texto */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 stroke-[1.75]" />
            <input
              type="text"
              placeholder="Buscar por ID o nombre..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              disabled={isLoading}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-zinc-300 bg-white text-primary placeholder-zinc-400 hover:border-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25 focus:outline-none transition-all duration-150 disabled:opacity-50 disabled:bg-zinc-50"
            />
          </div>

          {/* Filtro por Categoría */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              disabled={isLoading}
              className="px-2.5 py-1.5 text-xs rounded-md border border-zinc-300 bg-white text-primary hover:border-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25 focus:outline-none transition-all duration-150 disabled:opacity-50"
              aria-label="Filtrar por categoría"
            >
              <option value="ALL">Todas las categorías</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              disabled={isLoading}
              className="px-2.5 py-1.5 text-xs rounded-md border border-zinc-300 bg-white text-primary hover:border-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25 focus:outline-none transition-all duration-150 disabled:opacity-50"
              aria-label="Filtrar por estado de stock"
            >
              <option value="ALL">Todos los estados</option>
              <option value="OPTIMAL">Stock óptimo</option>
              <option value="LOW">Stock bajo</option>
              <option value="OUT">Agotado</option>
            </select>
          </div>

          {/* Limpiar Filtros */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              disabled={isLoading}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/25 disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Botones Primarios de Acción */}
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onExportCsv(filteredProducts)}
            disabled={isLoading || filteredProducts.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md shadow-sm hover:bg-zinc-50 active:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600/25 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 stroke-[1.75]" />
            Exportar a CSV
          </button>

          <button
            onClick={onOpenCreate}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tabla de Productos Compacta */}
      <div className="overflow-x-auto border border-zinc-200 rounded-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50 text-secondary border-b border-zinc-200 font-medium uppercase text-[11px] tracking-wider">
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Nombre</th>
              <th className="py-2.5 px-3">Categoría</th>
              <th className="py-2.5 px-3 text-right">Cantidad</th>
              <th className="py-2.5 px-3 text-right">Precio Unitario (COP)</th>
              <th className="py-2.5 px-3">Estado</th>
              <th className="py-2.5 px-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-secondary">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Cargando productos desde la base de datos...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                    <XCircle className="w-8 h-8 text-zinc-300" />
                    <p className="text-xs font-medium text-primary">
                      {hasActiveFilters
                        ? 'No hay productos que coincidan con los filtros aplicados'
                        : 'El inventario no contiene productos'}
                    </p>
                    <p className="text-[12px] text-secondary text-center">
                      {hasActiveFilters
                        ? 'Intenta ajustar los criterios de búsqueda o limpia los filtros activos.'
                        : 'Comienza creando el primer producto en la base de datos.'}
                    </p>
                    {hasActiveFilters ? (
                      <button
                        onClick={clearFilters}
                        className="mt-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/25"
                      >
                        Limpiar filtros
                      </button>
                    ) : (
                      <button
                        onClick={onOpenCreate}
                        className="mt-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                      >
                        + Nuevo producto
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProducts.map(product => (
                <tr
                  key={product.id}
                  className="group transition-colors duration-150 hover:bg-zinc-50/80 h-10"
                >
                  <td className="py-2 px-3 font-mono text-[11px] text-secondary font-medium tabular-nums">
                    {product.id}
                  </td>
                  <td className="py-2 px-3 font-medium text-primary">
                    {product.name}
                  </td>
                  <td className="py-2 px-3 text-secondary">
                    {product.category}
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-primary tabular-nums">
                    {product.stock} uds
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-primary tabular-nums">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-2 px-3">
                    <StatusBadge stock={product.stock} minStock={product.minStock} />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onOpenEdit(product)}
                        disabled={isLoading}
                        aria-label={`Editar producto ${product.name}`}
                        className="p-1 rounded text-zinc-500 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/25 disabled:opacity-50"
                        title="Editar producto"
                      >
                        <Edit2 className="w-3.5 h-3.5 stroke-[1.75]" />
                      </button>
                      <button
                        onClick={() => onOpenDelete(product)}
                        disabled={isLoading}
                        aria-label={`Eliminar producto ${product.name}`}
                        className="p-1 rounded text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600/25 disabled:opacity-50"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pie de Tabla con Controles de Paginación */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-secondary border-t border-zinc-100">
          <div className="tabular-nums font-medium">
            Mostrando{' '}
            <span className="text-primary font-semibold">
              {(safeCurrentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            a{' '}
            <span className="text-primary font-semibold">
              {Math.min(safeCurrentPage * itemsPerPage, filteredProducts.length)}
            </span>{' '}
            de{' '}
            <span className="text-primary font-semibold">
              {filteredProducts.length}
            </span>{' '}
            productos
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] mr-1 tabular-nums">
              Página {safeCurrentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1 || isLoading}
              className="p-1 rounded border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/25 disabled:opacity-40 disabled:bg-zinc-50 disabled:cursor-not-allowed"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={safeCurrentPage >= totalPages || isLoading}
              className="p-1 rounded border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/25 disabled:opacity-40 disabled:bg-zinc-50 disabled:cursor-not-allowed"
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
