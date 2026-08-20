import { query } from '../config/db.js';

/**
 * Obtener todas las categorías y conteo de productos asociados
 */
export async function getAllCategories(req, res, next) {
  try {
    const sql = `
      SELECT 
        c.id, 
        c.name, 
        c.created_at,
        COUNT(p.id)::int AS product_count,
        COALESCE(SUM(p.stock), 0)::int AS total_stock,
        COALESCE(SUM(p.stock * p.price), 0)::numeric(15, 2) AS total_value
      FROM categories c
      LEFT JOIN products p ON p.category_name = c.name
      GROUP BY c.id, c.name, c.created_at
      ORDER BY c.name ASC;
    `;
    const result = await query(sql);

    // Lista simple de nombres (compatible con frontend) y detallada
    const names = result.rows.map(r => r.name);

    res.json({
      data: names,
      details: result.rows.map(r => ({
        id: r.id,
        name: r.name,
        productCount: r.product_count,
        totalStock: r.total_stock,
        totalValue: parseFloat(r.total_value),
        createdAt: r.created_at,
      })),
      total: result.rowCount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Crear una nueva categoría
 */
export async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    const result = await query(
      'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *',
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: 'La categoría ya existe',
        data: { name },
      });
    }

    res.status(201).json({
      message: 'Categoría creada con éxito',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}
