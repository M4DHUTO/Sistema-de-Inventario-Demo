/**
 * Global utility for formatting monetary values to Colombian Pesos (COP).
 * Format: $ 47.500 (without decimals as per es-CO standard).
 */
const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$ 0';
  }
  return copFormatter.format(amount);
};
