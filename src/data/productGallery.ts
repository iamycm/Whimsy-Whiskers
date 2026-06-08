// Number of detail images per product, hosted on Supabase Storage at
// product-images/products/{id}/{n}.jpg (indices start at 2; main image is on the product row).
const STORAGE_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images`;

export const productGalleryCounts: Record<number, number> = {
  1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5,
  7: 6, 8: 6, 9: 6,
  10: 5, 11: 5, 12: 5,
  13: 6,
  14: 5, 15: 5,
  18: 5, 19: 5, 20: 5, 21: 5,
  22: 4,
  23: 5, 24: 5, 25: 5, 26: 5, 27: 5, 28: 5, 29: 5, 30: 5,
  31: 5, 32: 5, 33: 5, 34: 5,
  35: 4, 36: 4,
  37: 1,
  38: 5, 39: 5, 40: 5, 41: 5, 42: 5, 43: 5,
  44: 4,
  45: 5, 46: 5, 47: 5, 48: 5, 49: 5, 50: 5,
};

export function getGalleryImages(productId: number | string): string[] {
  const id = typeof productId === 'string' ? Number(productId) : productId;
  const count = productGalleryCounts[id] ?? 0;
  return Array.from({ length: count }, (_, i) => `${STORAGE_BASE}/products/${id}/${i + 2}.jpg`);
}
