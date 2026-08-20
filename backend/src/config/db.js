import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración flexible: soporta DATABASE_URL o variables individuales (PGHOST, PGUSER, etc.)
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('sslmode=require') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      database: process.env.PGDATABASE || 'inventario_db',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      max: 20, // Máximo de conexiones concurrentes en el pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000,
    };

export const pool = new Pool(poolConfig);

// Eventos del pool para monitoreo y logs
pool.on('connect', () => {
  // Conexión exitosa adquirida por el pool
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el cliente inactivo de PostgreSQL:', err.message);
});

/**
 * Ejecuta una consulta SQL parametrizada
 * @param {string} text - Consulta SQL
 * @param {Array} params - Parámetros seguros
 * @returns {Promise<pg.QueryResult>}
 */
export async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      // Log conciso para depuración
      // console.log(`[SQL] Ejecutado en ${duration}ms: ${text.slice(0, 80)}...`);
    }
    return res;
  } catch (error) {
    console.error(`❌ Error al ejecutar consulta SQL:\nQuery: ${text}\nError: ${error.message}`);
    throw error;
  }
}

/**
 * Prueba la conectividad con la base de datos PostgreSQL
 * @returns {Promise<{ ok: boolean, version?: string, error?: string }>}
 */
export async function testConnection() {
  try {
    const res = await pool.query('SELECT version(), current_database(), current_user;');
    return {
      ok: true,
      database: res.rows[0].current_database,
      user: res.rows[0].current_user,
      version: res.rows[0].version,
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
    };
  }
}
