
/**
 * Filters and sorts products by price.
 * @param {Array} products - The array of product objects.
 * @param {boolean} isAsc - If true, sort ascending; if false, descending.
 * @returns {Array} 
 */
export default function filterByPrice(products, isAsc = true) {
  if (!Array.isArray(products)) return [];
  return [...products].sort((a, b) => {
    if (isAsc) return a.price - b.price;
    return b.price - a.price;
  });
}
