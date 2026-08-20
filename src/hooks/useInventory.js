import { useState, useCallback, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_LOGS } from '../data/mockData';
import { api } from '../services/api';

export function useInventory() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);

  // Helper to log activities locally
  const logActivityLocal = (action, details, type = 'UPDATE') => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      user: 'Usuario 1',
      action,
      details,
      timestamp: new Date().toISOString(),
      type,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Cargar datos desde la API si el backend está activo
  const refreshData = useCallback(async () => {
    try {
      const health = await api.getHealth();
      setBackendHealth(health);

      if (health.status === 'healthy' || health.database?.connected) {
        setIsLiveBackend(true);
        const [prodsData, logsData] = await Promise.all([
          api.getProducts(),
          api.getLogs(),
        ]);
        if (Array.isArray(prodsData)) {
          setProducts(prodsData);
        }
        if (Array.isArray(logsData)) {
          setLogs(logsData);
        }
      } else {
        setIsLiveBackend(false);
      }
    } catch (err) {
      console.warn('Backend PostgreSQL no alcanzable, usando modo demostración local:', err.message);
      setIsLiveBackend(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  /**
   * Agregar un nuevo producto al inventario
   */
  const addProduct = useCallback(async (productData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isLiveBackend) {
        const created = await api.createProduct({
          name: productData.name.trim(),
          category: productData.category,
          category_name: productData.category,
          stock: Number(productData.stock),
          price: Number(productData.price),
          minStock: Number(productData.minStock || 15),
          min_stock: Number(productData.minStock || 15),
        });
        await refreshData();
        setIsLoading(false);
        return created;
      }

      // Fallback local
      const nextNum = products.length + 1;
      const idStr = String(nextNum).padStart(3, '0');
      const newId = `PRD-${idStr}`;

      const newProduct = {
        id: newId,
        name: productData.name.trim(),
        category: productData.category,
        stock: Number(productData.stock),
        price: Number(productData.price),
        minStock: Number(productData.minStock || 15),
        updatedAt: new Date().toISOString(),
      };

      setProducts(prev => [newProduct, ...prev]);
      logActivityLocal('creó el producto', `${newProduct.name} en ${newProduct.category}`, 'CREATE');
      setIsLoading(false);
      return newProduct;
    } catch (err) {
      setError(err.message || 'Error al conectar con la base de datos PostgreSQL');
      setIsLoading(false);
      throw err;
    }
  }, [isLiveBackend, products.length, refreshData]);

  /**
   * Actualizar un producto existente
   */
  const updateProduct = useCallback(async (id, updatedFields) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isLiveBackend) {
        const updated = await api.updateProduct(id, {
          name: updatedFields.name,
          category: updatedFields.category,
          category_name: updatedFields.category,
          stock: Number(updatedFields.stock),
          price: Number(updatedFields.price),
          minStock: Number(updatedFields.minStock),
          min_stock: Number(updatedFields.minStock),
        });
        await refreshData();
        setIsLoading(false);
        return updated;
      }

      // Fallback local
      let updatedProd = null;
      setProducts(prev =>
        prev.map(p => {
          if (p.id === id) {
            updatedProd = {
              ...p,
              ...updatedFields,
              stock: Number(updatedFields.stock),
              price: Number(updatedFields.price),
              updatedAt: new Date().toISOString(),
            };
            return updatedProd;
          }
          return p;
        })
      );

      if (updatedProd) {
        logActivityLocal('actualizó el producto', `${updatedProd.name} — stock: ${updatedProd.stock}`, 'UPDATE');
      }

      setIsLoading(false);
      return updatedProd;
    } catch (err) {
      setError(err.message || 'Error al actualizar registro en PostgreSQL');
      setIsLoading(false);
      throw err;
    }
  }, [isLiveBackend, refreshData]);

  /**
   * Eliminar un producto
   */
  const deleteProduct = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isLiveBackend) {
        await api.deleteProduct(id);
        await refreshData();
        setIsLoading(false);
        return true;
      }

      // Fallback local
      const target = products.find(p => p.id === id);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (target) {
        logActivityLocal('eliminó el producto', `${target.name} (${target.id})`, 'DELETE');
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar registro en PostgreSQL');
      setIsLoading(false);
      throw err;
    }
  }, [isLiveBackend, products, refreshData]);

  /**
   * Restaurar datos iniciales de prueba
   */
  const resetToInitial = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isLiveBackend) {
        await api.resetDatabase();
        await refreshData();
      } else {
        setProducts(INITIAL_PRODUCTS);
        setLogs(INITIAL_LOGS);
        logActivityLocal('reinició el sistema', 'Restaurados datos iniciales de prueba', 'ALERT');
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [isLiveBackend, refreshData]);

  // Métricas Calculadas
  const totalProducts = products.length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < (p.minStock || 30)).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return {
    products,
    logs,
    isLoading,
    error,
    isLiveBackend,
    backendHealth,
    totalProducts,
    totalValue,
    lowStockCount,
    outOfStockCount,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToInitial,
    refreshData,
  };
}
