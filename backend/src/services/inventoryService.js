import { query } from '../config/db.js';

/**
 * Transforma un registro de producto de PostgreSQL al formato esperado por el frontend
 */
export function formatProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category_name,
    categoryName: row.category_name,
    stock: parseInt(row.stock, 10),
    price: parseFloat(row.price),
    minStock: parseInt(row.min_stock, 10),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Transforma un registro de log de actividad al formato esperado por el frontend
 */
export function formatLog(row) {
  if (!row) return null;
  return {
    id: `LOG-${row.id}`,
    rawId: row.id,
    user: row.username,
    username: row.username,
    action: row.action,
    details: row.details,
    type: row.action_type,
    timestamp: row.created_at,
    createdAt: row.created_at,
  };
}

/**
 * Genera el siguiente ID secuencial de producto en formato PRD-XXX
 */
export async function generateNextProductId() {
  const result = await query(`
    SELECT id FROM products 
    WHERE id ~ '^PRD-[0-9]+$' 
    ORDER BY CAST(SUBSTRING(id FROM 5) AS INTEGER) DESC 
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return 'PRD-001';
  }

  const lastId = result.rows[0].id;
  const numPart = parseInt(lastId.replace('PRD-', ''), 10);
  const nextNum = isNaN(numPart) ? 1 : numPart + 1;
  return `PRD-${String(nextNum).padStart(3, '0')}`;
}

/**
 * Registra una acción en la tabla de activity_logs
 */
export async function createActivityLog({
  username = 'Usuario 1',
  action,
  details,
  actionType = 'UPDATE',
}) {
  try {
    const res = await query(
      `INSERT INTO activity_logs (username, action, details, action_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [username, action, details, actionType]
    );
    return formatLog(res.rows[0]);
  } catch (error) {
    console.error('⚠️ No se pudo registrar log de actividad:', error.message);
    return null;
  }
}
