import { query } from '../config/db.js';
import { formatLog, createActivityLog } from '../services/inventoryService.js';

/**
 * Obtener historial de auditoría y trazabilidad
 */
export async function getAllLogs(req, res, next) {
  try {
    const { limit = 20, type, search } = req.query;
    const conditions = [];
    const params = [];

    if (type) {
      params.push(type.toUpperCase());
      conditions.push(`action_type = $${params.length}`);
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(username ILIKE $${params.length} OR action ILIKE $${params.length} OR details ILIKE $${params.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitNum = parseInt(limit, 10) || 20;

    params.push(limitNum);
    const sql = `
      SELECT * FROM activity_logs 
      ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT $${params.length}
    `;

    const result = await query(sql, params);

    res.json({
      data: result.rows.map(formatLog),
      total: result.rowCount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Crear un log de actividad explícito (ej. exportación CSV, alerta manual)
 */
export async function createLog(req, res, next) {
  try {
    const { username = 'Usuario 1', action, details, actionType = 'UPDATE', type } = req.body;

    if (!action) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'La acción del log es obligatoria.',
      });
    }

    const log = await createActivityLog({
      username,
      action,
      details,
      actionType: actionType || type || 'UPDATE',
    });

    res.status(201).json({
      message: 'Log registrado con éxito',
      data: log,
    });
  } catch (error) {
    next(error);
  }
}
