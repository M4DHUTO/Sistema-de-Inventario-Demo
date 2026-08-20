/**
 * Middleware para validar datos de entrada de productos
 */
export function validateProductPayload(req, res, next) {
  const { name, category, category_name, stock, price, minStock, min_stock } = req.body;

  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('El nombre del producto es obligatorio.');
  }

  const cat = category || category_name;
  if (!cat || typeof cat !== 'string' || cat.trim().length === 0) {
    errors.push('La categoría del producto es obligatoria.');
  }

  if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
    errors.push('El stock debe ser un número entero mayor o igual a 0.');
  }

  if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
    errors.push('El precio debe ser un número mayor o igual a 0.');
  }

  const min = minStock !== undefined ? minStock : min_stock;
  if (min !== undefined && (isNaN(Number(min)) || Number(min) < 0)) {
    errors.push('El stock mínimo debe ser un número mayor o igual a 0.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Datos de producto inválidos',
      messages: errors,
    });
  }

  // Normalizar payload en req.body
  req.body.name = name.trim();
  req.body.category_name = cat.trim();
  req.body.stock = parseInt(stock, 10);
  req.body.price = parseFloat(price);
  req.body.min_stock = min !== undefined ? parseInt(min, 10) : 15;

  next();
}

/**
 * Middleware para validar datos de categoría
 */
export function validateCategoryPayload(req, res, next) {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Datos inválidos',
      message: 'El nombre de la categoría es obligatorio y no puede estar vacío.',
    });
  }
  req.body.name = name.trim();
  next();
}
