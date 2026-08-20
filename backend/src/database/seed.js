import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runSeed() {
  console.log('🌱 Sembrando datos en PostgreSQL...');
  try {
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await pool.query(seedSql);
    console.log('✅ Seed completado con éxito.');
  } catch (err) {
    console.error('❌ Error al sembrar datos:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
