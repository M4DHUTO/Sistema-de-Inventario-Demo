import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query, testConnection } from '../config/db.js';
import { createActivityLog } from '../services/inventoryService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Health check y verificación de conexión a PostgreSQL
 */
export async function getHealth(req, res) {
  const dbStatus = await testConnection();
  res.json({
    status: dbStatus.ok ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      type: 'PostgreSQL',
      connected: dbStatus.ok,
      currentDb: dbStatus.database || null,
      currentUser: dbStatus.user || null,
      version: dbStatus.version || null,
      error: dbStatus.error || null,
    },
  });
}

/**
 * Reiniciar la base de datos a los datos de prueba iniciales
 */
export async function resetDatabase(req, res, next) {
  try {
    const seedPath = path.join(__dirname, '../database/seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');

    // Limpiar tablas y reseeding
    await query('TRUNCATE TABLE activity_logs, products, categories RESTART IDENTITY CASCADE;');
    await query(seedSql);

    await createActivityLog({
      username: 'Sistema',
      action: 'reinició la base de datos',
      details: 'Restaurados 18 productos y categorías en PostgreSQL',
      actionType: 'ALERT',
    });

    res.json({
      message: 'Base de datos restaurada al estado inicial con 18 productos.',
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Ejecutar consulta SQL de solo lectura (para el simulador de PgSchemaView)
 */
export async function executeReadOnlyQuery(req, res, next) {
  try {
    const { sql } = req.body;

    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({ error: 'Debes proporcionar una consulta SQL en el cuerpo.' });
    }

    const trimmed = sql.trim();
    // Validar que sea únicamente SELECT o EXPLAIN
    if (!/^(SELECT|EXPLAIN)\s+/i.test(trimmed)) {
      return res.status(403).json({
        error: 'Operación no permitida',
        message: 'El simulador SQL solo permite consultas de lectura (SELECT o EXPLAIN).',
      });
    }

    const start = Date.now();
    const result = await query(trimmed);
    const executionTimeMs = Date.now() - start;

    res.json({
      rowCount: result.rowCount,
      fields: result.fields ? result.fields.map(f => f.name) : [],
      rows: result.rows,
      executionTimeMs,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error de sintaxis o ejecución SQL',
      message: error.message,
    });
  }
}
