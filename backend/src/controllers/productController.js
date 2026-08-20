import { query } from '../config/db.js';
import {
  formatProduct,
  generateNextProductId,
  createActivityLog,
} from '../services/inventoryService.js';

/**
 * Obtener todos los productos con soporte para filtros de búsqueda, categoría, estado y paginación
 */
export async function getAllProducts(req, res, next) {
  try {
    const {
      search,
      category,
      status,
      page,
      limit,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = req.query;

    const conditions = [];
    const params = [];

    // 1. Filtro por búsqueda de texto (ID, Nombre o Categoría)
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(id ILIKE $${params.length} OR name ILIKE $${params.length} OR category_name ILIKE $${params.length})`);
    }

    // 2. Filtro por categoría específica
    if (category && category !== 'ALL') {
      params.push(category.trim());
      conditions.push(`category_name = $${params.length}`);
    }

    // 3. Filtro por estado de inventario
    if (status === 'OPTIMAL') {
      conditions.push(`stock >= min_stock`);
    } else if (status === 'LOW') {
      conditions.push(`stock > 0 AND stock < min_stock`);
    } else if (status === 'OUT') {
      conditions.push(`stock = 0`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Mapeo seguro de campos de ordenamiento
    const sortFieldMap = {
      id: 'id',
      name: 'name',
      category: 'category_name',
      stock: 'stock',
      price: 'price',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
    const safeSortBy = sortFieldMap[sortBy] || 'id';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Si se solicita paginación explícita
    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const offset = (pageNum - 1) * limitNum;

      // Obtener conteo total
      const countRes = await query(`SELECT COUNT(*) FROM products ${whereClause}`, params);
      const totalItems = parseInt(countRes.rows[0].count, 10);
      const totalPages = Math.ceil(totalItems / limitNum) || 1;

      // Consulta paginada
      const dataParams = [...params, limitNum, offset];
      const dataSql = `
        SELECT * FROM products 
        ${whereClause} 
        ORDER BY ${safeSortBy} ${safeSortOrder} 
        LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
      `;
      const dataRes = await query(dataSql, dataParams);

      return res.json({
        data: dataRes.rows.map(formatProduct),
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
        },
      });
    }

    // Retorno completo de productos
    const sql = `SELECT * FROM products ${whereClause} ORDER BY ${safeSortBy} ${safeSortOrder}`;
    const result = await query(sql, params);

    res.json({
      data: result.rows.map(formatProduct),
      total: result.rowCount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener producto por ID
 */
export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: `No existe ningún producto con el identificador ${id}`,
      });
    }

    res.json({ data: formatProduct(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

/**
 * Crear un nuevo producto en PostgreSQL
 */
export async function createProduct(req, res, next) {
  try {
    const { id, name, category_name, stock, price, min_stock, username = 'Usuario 1' } = req.body;

    // Asegurar que la categoría exista en la tabla 'categories'
    await query(
      'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
      [category_name]
    );

    // Generar ID si no fue provisto
    const productId = id ? id.trim() : await generateNextProductId();

    const insertSql = `
      INSERT INTO products (id, name, category_name, stock, price, min_stock)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await query(insertSql, [
      productId,
      name,
      category_name,
      stock,
      price,
      min_stock,
    ]);

    const createdProduct = formatProduct(result.rows[0]);

    // Registrar en activity_logs
    await createActivityLog({
      username,
      action: 'creó el producto',
      details: `${createdProduct.name} en ${createdProduct.category}`,
      actionType: 'CREATE',
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Actualizar producto existente
 */
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, category_name, stock, price, min_stock, username = 'Usuario 1' } = req.body;

    // Verificar existencia previa
    const checkRes = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: `No se encontró el producto ${id} para actualizar`,
      });
    }

    const previousProduct = checkRes.rows[0];

    // Asegurar categoría si cambió
    if (category_name) {
      await query(
        'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [category_name]
      );
    }

    const updateSql = `
      UPDATE products 
      SET 
        name = COALESCE($1, name),
        category_name = COALESCE($2, category_name),
        stock = COALESCE($3, stock),
        price = COALESCE($4, price),
        min_stock = COALESCE($5, min_stock)
      WHERE id = $6
      RETURNING *
    `;

    const result = await query(updateSql, [
      name || null,
      category_name || null,
      stock !== undefined ? stock : null,
      price !== undefined ? price : null,
      min_stock !== undefined ? min_stock : null,
      id,
    ]);

    const updatedProduct = formatProduct(result.rows[0]);

    // Determinar tipo de log
    let action = 'actualizó el producto';
    let actionType = 'UPDATE';
    let details = `${updatedProduct.name} — stock: ${updatedProduct.stock}`;

    if (previousProduct.stock !== updatedProduct.stock) {
      if (updatedProduct.stock === 0) {
        action = 'marcó como agotado';
        actionType = 'ALERT';
        details = `${updatedProduct.name}`;
      } else if (updatedProduct.stock > previousProduct.stock) {
        action = 'registró entrada de inventario';
        actionType = 'STOCK_IN';
        details = `${updatedProduct.name} (+${updatedProduct.stock - previousProduct.stock} unidades)`;
      }
    }

    await createActivityLog({
      username,
      action,
      details,
      actionType,
    });

    res.json({
      message: 'Producto actualizado exitosamente',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Eliminar producto de PostgreSQL
 */
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { username = 'Usuario 1' } = req.body || {};

    const checkRes = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: `No existe el producto ${id} para eliminar`,
      });
    }

    const targetProduct = checkRes.rows[0];

    await query('DELETE FROM products WHERE id = $1', [id]);

    await createActivityLog({
      username,
      action: 'eliminó el producto',
      details: `${targetProduct.name} (${targetProduct.id})`,
      actionType: 'DELETE',
    });

    res.json({
      message: `Producto ${id} eliminado exitosamente`,
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
}
