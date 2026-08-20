/**
 * API Service Client para interactuar con el backend Node.js + PostgreSQL
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText };
    }
    const error = new Error(errorData.message || 'Error en la petición a la API');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  return response.json();
}

export const api = {
  /**
   * Verificar estado de salud y conexión con PostgreSQL
   */
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      return await handleResponse(res);
    } catch (error) {
      return { status: 'offline', database: { connected: false, error: error.message } };
    }
  },

  /**
   * Obtener lista de productos con filtros
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
    const res = await fetch(url);
    const data = await handleResponse(res);
    return data.data || data;
  },

  /**
   * Obtener un producto por ID
   */
  async getProductById(id) {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`);
    const data = await handleResponse(res);
    return data.data;
  },

  /**
   * Crear nuevo producto
   */
  async createProduct(productData) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  /**
   * Actualizar producto existente
   */
  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  /**
   * Eliminar producto
   */
  async deleteProduct(id) {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  },

  /**
   * Obtener categorías
   */
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const data = await handleResponse(res);
    return data.data;
  },

  /**
   * Obtener historial de auditoría y trazabilidad
   */
  async getLogs(limit = 20) {
    const res = await fetch(`${API_BASE_URL}/logs?limit=${limit}`);
    const data = await handleResponse(res);
    return data.data;
  },

  /**
   * Registrar un log manual
   */
  async createLog(logData) {
    const res = await fetch(`${API_BASE_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  /**
   * Obtener estadísticas analíticas del dashboard
   */
  async getStats() {
    const res = await fetch(`${API_BASE_URL}/stats`);
    return await handleResponse(res);
  },

  /**
   * Reiniciar base de datos a los 18 productos iniciales
   */
  async resetDatabase() {
    const res = await fetch(`${API_BASE_URL}/db/reset`, {
      method: 'POST',
    });
    return await handleResponse(res);
  },

  /**
   * Ejecutar consulta SQL de solo lectura
   */
  async executeSql(sql) {
    const res = await fetch(`${API_BASE_URL}/db/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
    });
    return await handleResponse(res);
  },
};
