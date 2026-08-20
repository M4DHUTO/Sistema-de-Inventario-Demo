import { query } from '../config/db.js';
import { formatProduct } from '../services/inventoryService.js';

/**
 * Obtener estadísticas analíticas agregadas directamente con SQL
 */
export async function getDashboardStats(req, res, next) {
  try {
    // 1. Métricas KPI principales
    const kpiSql = `
      SELECT 
        COUNT(*)::int AS total_products,
        COALESCE(SUM(price * stock), 0)::numeric(15, 2) AS total_value,
        COUNT(*) FILTER (WHERE stock > 0 AND stock < min_stock)::int AS low_stock_count,
        COUNT(*) FILTER (WHERE stock = 0)::int AS out_of_stock_count
      FROM products;
    `;
    const kpiRes = await query(kpiSql);
    const kpi = kpiRes.rows[0];

    // 2. Distribución de valor y unidades por categoría (para InventoryChart)
    const catSql = `
      SELECT 
        category_name AS name,
        COALESCE(SUM(price * stock), 0)::numeric(15, 2) AS value,
        COALESCE(SUM(stock), 0)::int AS "totalStock"
      FROM products
      GROUP BY category_name
      ORDER BY value DESC;
    `;
    const catRes = await query(catSql);

    // 3. Productos urgentes de reabastecimiento (stock < min_stock)
    const urgentSql = `
      SELECT * FROM products 
      WHERE stock < min_stock 
      ORDER BY stock ASC, updated_at DESC 
      LIMIT 10;
    `;
    const urgentRes = await query(urgentSql);

    res.json({
      totalProducts: kpi.total_products || 0,
      totalValue: parseFloat(kpi.total_value) || 0,
      lowStockCount: kpi.low_stock_count || 0,
      outOfStockCount: kpi.out_of_stock_count || 0,
      categoryDistribution: catRes.rows.map(r => ({
        name: r.name,
        value: parseFloat(r.value),
        totalStock: r.totalStock,
      })),
      urgentItems: urgentRes.rows.map(formatProduct),
    });
  } catch (error) {
    next(error);
  }
}
