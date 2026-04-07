import { Product } from './types';
import { MOCK_PRODUCTS } from './mock-data';

/**
 * API abstraction layer for product operations.
 * This layer isolates mock data and can be easily swapped for real API calls.
 */

export async function fetchProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_PRODUCTS;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_PRODUCTS.find((p) => p.id === id) || null;
}

export async function searchProducts(
  query: string,
  products?: Product[]
): Promise<Product[]> {
  const data = products || (await fetchProducts());
  const lowerQuery = query.toLowerCase();

  return data.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

export async function getProductsByCategory(
  category: string,
  products?: Product[]
): Promise<Product[]> {
  const data = products || (await fetchProducts());
  if (!category) return data;
  return data.filter((p) => p.category === category);
}

export async function getRelatedProducts(
  productId: string,
  limit: number = 3
): Promise<Product[]> {
  const product = await fetchProductById(productId);
  if (!product) return [];

  const related = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== productId
  );

  return related.slice(0, limit);
}
