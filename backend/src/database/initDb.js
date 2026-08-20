import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client, Pool } = pg;

async function ensureDatabaseExists() {
  // Solo aplicable si no estamos usando DATABASE_URL externa que ya tiene DB fija
  if (process.env.DATABASE_URL) {
    return;
  }

  const targetDb = process.env.PGDATABASE || 'inventario_db';
  const adminClient = new Client({
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: 'postgres', // Conectar a la base default de administración
  });

  try {
    await adminClient.connect();
    const checkDb = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [targetDb]
    );

    if (checkDb.rowCount === 0) {
      console.log(`📦 Creando base de datos '${targetDb}'...`);
      await adminClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`✅ Base de datos '${targetDb}' creada exitosamente.`);
    } else {
      console.log(`ℹ️ La base de datos '${targetDb}' ya existe.`);
    }
  } catch (err) {
    console.warn(`⚠️ Advertencia al verificar/crear base de datos: ${err.message}`);
  } finally {
    await adminClient.end();
  }
}

export async function initDatabase() {
  console.log('🚀 Iniciando configuración de PostgreSQL para Control de Inventario...');
  
  await ensureDatabaseExists();

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
      };

  const pool = new Pool(poolConfig);

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');

    console.log('⏳ Ejecutando DDL Schema (tablas, triggers, índices)...');
    await pool.query(schemaSql);
    console.log('✅ Esquema DDL aplicado correctamente.');

    console.log('⏳ Insertando datos iniciales de prueba (categorías, productos, logs)...');
    await pool.query(seedSql);
    console.log('✅ Datos iniciales sembrados exitosamente.');

    // Verificación de conteo
    const prodCount = await pool.query('SELECT count(*) FROM products');
    const catCount = await pool.query('SELECT count(*) FROM categories');
    const logCount = await pool.query('SELECT count(*) FROM activity_logs');

    console.log('\n📊 Resumen de Base de Datos PostgreSQL:');
    console.log(` - Categorías registradas: ${catCount.rows[0].count}`);
    console.log(` - Productos registrados: ${prodCount.rows[0].count}`);
    console.log(` - Logs de auditoría:     ${logCount.rows[0].count}`);
    console.log('✨ Base de datos lista para operar.\n');
  } catch (error) {
    console.error('❌ Error durante la inicialización de la base de datos:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Ejecución directa desde CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
