-- ==========================================================
-- PostgreSQL Seed Script for Control de inventario DEMO
-- ==========================================================

-- Insertar Categorías
INSERT INTO categories (name) VALUES
  ('Categoría 1'),
  ('Categoría 2'),
  ('Categoría 3'),
  ('Categoría 4'),
  ('Categoría 5')
ON CONFLICT (name) DO NOTHING;

-- Insertar Productos
INSERT INTO products (id, name, category_name, stock, price, min_stock, updated_at) VALUES
  ('PRD-001', 'Producto 1', 'Categoría 1', 132, 47500.00, 30, NOW() - INTERVAL '15 minutes'),
  ('PRD-002', 'Producto 2', 'Categoría 1', 7, 182900.00, 25, NOW() - INTERVAL '45 minutes'),
  ('PRD-003', 'Producto 3', 'Categoría 2', 0, 12300.00, 20, NOW() - INTERVAL '2 hours'),
  ('PRD-004', 'Producto 4', 'Categoría 2', 45, 95400.00, 15, NOW() - INTERVAL '4 hours'),
  ('PRD-005', 'Producto 5', 'Categoría 3', 3, 340000.00, 10, NOW() - INTERVAL '6 hours'),
  ('PRD-006', 'Producto 6', 'Categoría 3', 89, 28700.00, 20, NOW() - INTERVAL '8 hours'),
  ('PRD-007', 'Producto 7', 'Categoría 1', 210, 64100.00, 50, NOW() - INTERVAL '10 hours'),
  ('PRD-008', 'Producto 8', 'Categoría 4', 14, 512000.00, 20, NOW() - INTERVAL '12 hours'),
  ('PRD-009', 'Producto 9', 'Categoría 4', 0, 79900.00, 15, NOW() - INTERVAL '15 hours'),
  ('PRD-010', 'Producto 10', 'Categoría 2', 68, 115000.00, 25, NOW() - INTERVAL '17 hours'),
  ('PRD-011', 'Producto 11', 'Categoría 5', 165, 38400.00, 40, NOW() - INTERVAL '20 hours'),
  ('PRD-012', 'Producto 12', 'Categoría 5', 19, 214500.00, 20, NOW() - INTERVAL '22 hours'),
  ('PRD-013', 'Producto 13', 'Categoría 3', 4, 83200.00, 15, NOW() - INTERVAL '25 hours'),
  ('PRD-014', 'Producto 14', 'Categoría 1', 92, 149000.00, 30, NOW() - INTERVAL '30 hours'),
  ('PRD-015', 'Producto 15', 'Categoría 4', 118, 54300.00, 30, NOW() - INTERVAL '35 hours'),
  ('PRD-016', 'Producto 16', 'Categoría 2', 8, 429000.00, 10, NOW() - INTERVAL '40 hours'),
  ('PRD-017', 'Producto 17', 'Categoría 5', 0, 91800.00, 15, NOW() - INTERVAL '45 hours'),
  ('PRD-018', 'Producto 18', 'Categoría 3', 54, 176500.00, 20, NOW() - INTERVAL '50 hours')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category_name = EXCLUDED.category_name,
  stock = EXCLUDED.stock,
  price = EXCLUDED.price,
  min_stock = EXCLUDED.min_stock,
  updated_at = EXCLUDED.updated_at;

-- Insertar Logs Iniciales
INSERT INTO activity_logs (username, action, details, action_type, created_at) VALUES
  ('Usuario 1', 'actualizó el stock', 'Producto 2 (7 unidades)', 'UPDATE', NOW() - INTERVAL '5 minutes'),
  ('Usuario 2', 'registró entrada de inventario', 'Producto 1 (+50 unidades)', 'STOCK_IN', NOW() - INTERVAL '28 minutes'),
  ('Usuario 1', 'creó el producto', 'Producto 18 en Categoría 3', 'CREATE', NOW() - INTERVAL '70 minutes'),
  ('Usuario 3', 'marcó como agotado', 'Producto 3', 'ALERT', NOW() - INTERVAL '135 minutes'),
  ('Usuario 2', 'exportó reporte CSV', 'Filtro aplicado: Stock bajo', 'EXPORT', NOW() - INTERVAL '210 minutes');
