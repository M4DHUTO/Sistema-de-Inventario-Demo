/**
 * Strict Generic Mock Data for Inventory Control DEMO.
 * All items follow generic nomenclature: Producto 1..N, Categoría 1..N, Usuario 1..N.
 * Prices in COP with realistic non-round numbers and varied stock values.
 */

export const INITIAL_PRODUCTS = [
  { id: 'PRD-001', name: 'Producto 1', category: 'Categoría 1', stock: 132, price: 47500, minStock: 30, updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 'PRD-002', name: 'Producto 2', category: 'Categoría 1', stock: 7, price: 182900, minStock: 25, updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'PRD-003', name: 'Producto 3', category: 'Categoría 2', stock: 0, price: 12300, minStock: 20, updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'PRD-004', name: 'Producto 4', category: 'Categoría 2', stock: 45, price: 95400, minStock: 15, updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  { id: 'PRD-005', name: 'Producto 5', category: 'Categoría 3', stock: 3, price: 340000, minStock: 10, updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
  { id: 'PRD-006', name: 'Producto 6', category: 'Categoría 3', stock: 89, price: 28700, minStock: 20, updatedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString() },
  { id: 'PRD-007', name: 'Producto 7', category: 'Categoría 1', stock: 210, price: 64100, minStock: 50, updatedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString() },
  { id: 'PRD-008', name: 'Producto 8', category: 'Categoría 4', stock: 14, price: 512000, minStock: 20, updatedAt: new Date(Date.now() - 1000 * 60 * 750).toISOString() },
  { id: 'PRD-009', name: 'Producto 9', category: 'Categoría 4', stock: 0, price: 79900, minStock: 15, updatedAt: new Date(Date.now() - 1000 * 60 * 900).toISOString() },
  { id: 'PRD-010', name: 'Producto 10', category: 'Categoría 2', stock: 68, price: 115000, minStock: 25, updatedAt: new Date(Date.now() - 1000 * 60 * 1050).toISOString() },
  { id: 'PRD-011', name: 'Producto 11', category: 'Categoría 5', stock: 165, price: 38400, minStock: 40, updatedAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString() },
  { id: 'PRD-012', name: 'Producto 12', category: 'Categoría 5', stock: 19, price: 214500, minStock: 20, updatedAt: new Date(Date.now() - 1000 * 60 * 1350).toISOString() },
  { id: 'PRD-013', name: 'Producto 13', category: 'Categoría 3', stock: 4, price: 83200, minStock: 15, updatedAt: new Date(Date.now() - 1000 * 60 * 1500).toISOString() },
  { id: 'PRD-014', name: 'Producto 14', category: 'Categoría 1', stock: 92, price: 149000, minStock: 30, updatedAt: new Date(Date.now() - 1000 * 60 * 1800).toISOString() },
  { id: 'PRD-015', name: 'Producto 15', category: 'Categoría 4', stock: 118, price: 54300, minStock: 30, updatedAt: new Date(Date.now() - 1000 * 60 * 2100).toISOString() },
  { id: 'PRD-016', name: 'Producto 16', category: 'Categoría 2', stock: 8, price: 429000, minStock: 10, updatedAt: new Date(Date.now() - 1000 * 60 * 2400).toISOString() },
  { id: 'PRD-017', name: 'Producto 17', category: 'Categoría 5', stock: 0, price: 91800, minStock: 15, updatedAt: new Date(Date.now() - 1000 * 60 * 2700).toISOString() },
  { id: 'PRD-018', name: 'Producto 18', category: 'Categoría 3', stock: 54, price: 176500, minStock: 20, updatedAt: new Date(Date.now() - 1000 * 60 * 3000).toISOString() },
];

export const CATEGORIES = [
  'Categoría 1',
  'Categoría 2',
  'Categoría 3',
  'Categoría 4',
  'Categoría 5',
];

export const INITIAL_LOGS = [
  {
    id: 'LOG-101',
    user: 'Usuario 1',
    action: 'actualizó el stock',
    details: 'Producto 2 (7 unidades)',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: 'UPDATE',
  },
  {
    id: 'LOG-102',
    user: 'Usuario 2',
    action: 'registró entrada de inventario',
    details: 'Producto 1 (+50 unidades)',
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    type: 'STOCK_IN',
  },
  {
    id: 'LOG-103',
    user: 'Usuario 1',
    action: 'creó el producto',
    details: 'Producto 18 en Categoría 3',
    timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    type: 'CREATE',
  },
  {
    id: 'LOG-104',
    user: 'Usuario 3',
    action: 'marcó como agotado',
    details: 'Producto 3',
    timestamp: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
    type: 'ALERT',
  },
  {
    id: 'LOG-105',
    user: 'Usuario 2',
    action: 'exportó reporte CSV',
    details: 'Filtro aplicado: Stock bajo',
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    type: 'EXPORT',
  },
];
