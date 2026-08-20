import React, { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import { formatCurrency } from './utils/formatCurrency';
import { exportToCsv } from './utils/exportToCsv';
import { Navbar } from './components/Navbar';
import { KPICard } from './components/KPICard';
import { InventoryChart } from './components/InventoryChart';
import { ActivityLog } from './components/ActivityLog';
import { InventoryTable } from './components/InventoryTable';
import { ProductModal } from './components/ProductModal';
import { DeleteModal } from './components/DeleteModal';
import { ToastContainer } from './components/ToastContainer';
import { StatusBadge } from './components/StatusBadge';
import { Package, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';

export default function App() {
  const {
    products,
    logs,
    isLoading,
    totalProducts,
    totalValue,
    lowStockCount,
    outOfStockCount,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToInitial,
  } = useInventory();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Toasts notification state
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss in 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Handlers
  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleOpenDelete = (product) => {
    setProductToDelete(product);
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (productToEdit) {
        const updated = await updateProduct(productToEdit.id, formData);
        addToast({
          title: 'Producto actualizado',
          message: `Se guardaron los cambios para ${updated.name} (${updated.id}).`,
          type: 'success',
        });
      } else {
        const created = await addProduct(formData);
        addToast({
          title: 'Producto creado',
          message: `Se registró ${created.name} (${created.id}) exitosamente en el inventario.`,
          type: 'success',
        });
      }
      setIsProductModalOpen(false);
      setProductToEdit(null);
    } catch (err) {
      addToast({
        title: 'Error de operación',
        message: 'No se pudo guardar el registro en la base de datos.',
        type: 'error',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const targetName = productToDelete.name;
      const targetId = productToDelete.id;
      await deleteProduct(targetId);
      addToast({
        title: 'Producto eliminado',
        message: `El registro ${targetName} (${targetId}) fue eliminado del sistema.`,
        type: 'info',
      });
      setProductToDelete(null);
    } catch (err) {
      addToast({
        title: 'Error al eliminar',
        message: 'No se pudo eliminar el registro seleccionado.',
        type: 'error',
      });
    }
  };

  const handleExportCsv = (filteredData) => {
    const success = exportToCsv(filteredData);
    if (success) {
      addToast({
        title: 'Reporte CSV generado',
        message: `Se descargó el archivo con ${filteredData.length} registros del inventario.`,
        type: 'success',
      });
    } else {
      addToast({
        title: 'Sin datos para exportar',
        message: 'No hay elementos visibles en la vista actual.',
        type: 'error',
      });
    }
  };

  const handleResetData = async () => {
    await resetToInitial();
    addToast({
      title: 'Demo restaurada',
      message: 'Se cargaron los 18 productos iniciales y registros de prueba.',
      type: 'info',
    });
  };

  // Urgent stock items (less than minStock)
  const urgentStockItems = products.filter(p => p.stock < (p.minStock || 30)).slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification Banner */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Main Top Navigation Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        isLoading={isLoading}
      />

      {/* App Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* VIEW 1: DASHBOARD ANALÍTICO */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Total de productos"
                value={`${totalProducts} ítems`}
                detail="Activos en el catálogo"
                icon={Package}
                isDominant={true}
              />
              <KPICard
                title="Valor total inventario"
                value={formatCurrency(totalValue)}
                detail="Valorización total en COP"
                icon={DollarSign}
                highlightColor="text-blue-600"
              />
              <KPICard
                title="Stock bajo"
                value={`${lowStockCount} productos`}
                detail="Requieren reabastecimiento"
                icon={AlertTriangle}
                highlightColor={lowStockCount > 0 ? 'text-amber-600' : 'text-primary'}
              />
              <KPICard
                title="Agotados"
                value={`${outOfStockCount} productos`}
                detail="Stock igual a 0 unidades"
                icon={AlertTriangle}
                highlightColor={outOfStockCount > 0 ? 'text-red-600' : 'text-primary'}
              />
            </div>

            {/* Dominant Visual Grid Section: Chart + Activity Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Recharts Category Donut Chart */}
              <div className="lg:col-span-7">
                <InventoryChart products={products} />
              </div>

              {/* Right Column (5 cols): Activity Timeline Log */}
              <div className="lg:col-span-5">
                <ActivityLog logs={logs} />
              </div>
            </div>

            {/* Alertas Urgentes de Reabastecimiento */}
            <div className="bg-white border border-[#E5E7EB] rounded-md p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 stroke-[1.75]" />
                  <h3 className="text-sm font-semibold text-primary">
                    Alertas prioritarias de inventario (Stock bajo / Agotado)
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
                >
                  <span>Ver inventario completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-secondary font-medium uppercase text-[11px]">
                      <th className="py-2 px-3">ID</th>
                      <th className="py-2 px-3">Nombre</th>
                      <th className="py-2 px-3">Categoría</th>
                      <th className="py-2 px-3 text-right">Stock Actual</th>
                      <th className="py-2 px-3 text-right">Precio Unitario</th>
                      <th className="py-2 px-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {urgentStockItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-4 text-center text-secondary">
                          No hay alertas críticas de stock en este momento. Todos los productos están en nivel óptimo.
                        </td>
                      </tr>
                    ) : (
                      urgentStockItems.map(item => (
                        <tr key={item.id} className="hover:bg-zinc-50">
                          <td className="py-2 px-3 font-mono text-secondary font-medium tabular-nums">{item.id}</td>
                          <td className="py-2 px-3 font-medium text-primary">{item.name}</td>
                          <td className="py-2 px-3 text-secondary">{item.category}</td>
                          <td className="py-2 px-3 text-right font-medium tabular-nums">{item.stock} uds</td>
                          <td className="py-2 px-3 text-right font-medium tabular-nums">{formatCurrency(item.price)}</td>
                          <td className="py-2 px-3">
                            <StatusBadge stock={item.stock} minStock={item.minStock} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: GESTIÓN DE INVENTARIO (CRUD TABLE) */}
        {activeTab === 'inventory' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary tracking-tight">
                  Gestión de Inventario (CRUD)
                </h2>
                <p className="text-xs text-secondary">
                  Administra, busca, filtra y exporta los productos registrados en la base de datos.
                </p>
              </div>
            </div>

            <InventoryTable
              products={products}
              onOpenCreate={handleOpenCreate}
              onOpenEdit={handleOpenEdit}
              onOpenDelete={handleOpenDelete}
              onExportCsv={handleExportCsv}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        isLoading={isLoading}
      />

      <DeleteModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        product={productToDelete}
        isLoading={isLoading}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-3 px-4 text-center text-xs text-secondary">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <span className="font-medium text-primary">
            Control de inventario DEMO 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
