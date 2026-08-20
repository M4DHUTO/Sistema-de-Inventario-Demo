import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import logRoutes from './routes/logRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import { getHealth } from './controllers/dbController.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares globales
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin === '*' ? '*' : allowedOrigin.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint raíz de bienvenida / health check rápido
app.get('/', (req, res) => {
  res.json({
    name: 'Control de Inventario API REST',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/health',
  });
});

app.get('/api/health', getHealth);

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/db', dbRoutes);

// Manejo de ruta no encontrada (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Recurso no encontrado',
    message: `La ruta ${req.method} ${req.originalUrl} no existe en este servidor API.`,
  });
});

// Middleware centralizado de errores
app.use(errorHandler);

export default app;
