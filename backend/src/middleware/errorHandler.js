/**
 * Middleware centralizado de manejo de errores
 */
export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Manejo de errores específicos de PostgreSQL
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        return res.status(409).json({
          error: 'Registro duplicado',
          message: 'Ya existe un elemento con los mismos datos únicos (código o nombre).',
          detail: err.detail,
        });
      case '23503': // foreign_key_violation
        return res.status(400).json({
          error: 'Violación de clave foránea',
          message: 'La categoría especificada no existe o el elemento está siendo referenciado.',
          detail: err.detail,
        });
      case '23514': // check_violation
        return res.status(400).json({
          error: 'Restricción de validación violada',
          message: 'Los valores numéricos (precio, stock) deben cumplir las restricciones mínimas (>= 0).',
          detail: err.detail,
        });
      case '28P01': // invalid_password
      case 'ECONNREFUSED':
        return res.status(503).json({
          error: 'Error de conexión con la base de datos',
          message: 'No se pudo establecer conexión con PostgreSQL. Verifica que el servicio esté activo.',
        });
      default:
        break;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('💥 [Unhandled Error]:', err);
  }

  res.status(status).json({
    error: err.name || 'Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
