/**
 * Utility to convert inventory data to CSV and trigger browser download.
 */
export const exportToCsv = (data, filename = 'inventario_export.csv') => {
  if (!data || !data.length) return false;

  const headers = ['ID', 'Nombre', 'Categoría', 'Cantidad (Unidades)', 'Precio Unitario (COP)', 'Estado', 'Última Actualización'];

  const rows = data.map(item => [
    `"${item.id}"`,
    `"${item.name}"`,
    `"${item.category}"`,
    item.stock,
    item.price,
    `"${item.stock === 0 ? 'Agotado' : item.stock < 30 ? 'Stock bajo' : 'Stock óptimo'}"`,
    `"${new Date(item.updatedAt).toISOString()}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};
