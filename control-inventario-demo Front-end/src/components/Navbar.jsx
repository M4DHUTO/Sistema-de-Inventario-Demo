import React from 'react';
import { Package, LayoutDashboard, Database, RefreshCw, Layers } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, onResetData, isLoading }) {
  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 text-white rounded-md shadow-sm">
              <Package className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-primary leading-tight tracking-tight">
                Control de inventario DEMO
              </h1>
              <div className="flex items-center gap-1.5 text-[11px] text-secondary">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sistema de Gestión</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-100/80 p-1 rounded-md border border-zinc-200" aria-label="Navegación principal">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600/25 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-secondary hover:text-primary hover:bg-zinc-200/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 stroke-[1.75]" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600/25 ${
                activeTab === 'inventory'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-secondary hover:text-primary hover:bg-zinc-200/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 stroke-[1.75]" />
              Inventario (CRUD)
            </button>
          </nav>

          {/* Action: Reiniciar Datos Mock */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 active:bg-zinc-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/25 disabled:opacity-50"
              title="Restaurar inventario inicial de prueba"
            >
              <RefreshCw className={`w-3.5 h-3.5 stroke-[1.75] ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Restaurar Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
