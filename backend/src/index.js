import app from './app.js';
import { testConnection, pool } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  const server = app.listen(PORT, async () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Servidor Backend iniciado en: http://localhost:${PORT}`);
    console.log(`📡 Endpoints base disponibles en: http://localhost:${PORT}/api/products`);
    console.log(`🏥 Health check:                 http://localhost:${PORT}/api/health`);
    console.log(`======================================================`);

    const dbStatus = await testConnection();
    if (dbStatus.ok) {
      console.log(`✅ Conexión con PostgreSQL establecida:`);
      console.log(`   - Base de datos: ${dbStatus.database}`);
      console.log(`   - Usuario:       ${dbStatus.user}`);
    } else {
      console.warn(`⚠️ PostgreSQL no está listo o no responde: ${dbStatus.error}`);
      console.warn(`👉 Recuerda configurar las credenciales en 'backend/.env' y ejecutar 'npm run db:init'`);
    }
  });

  // Apagado elegante del servidor y cierre de conexiones del pool
  const shutdown = async (signal) => {
    console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor y conexiones de PostgreSQL...`);
    server.close(async () => {
      await pool.end();
      console.log('✅ Pool de conexiones cerrado. Proceso finalizado.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
