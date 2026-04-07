import { ITEMS_PER_PAGE, RELATED_PRODUCTS_LIMIT } from './constants';
import type {
  CategoryType,
  GetProductsParams,
  Product,
  ProductsResponse,
} from '@/types';

const API_BASE_URL = 'https://dummyjson.com';
const PRODUCT_FETCH_OPTIONS = { next: { revalidate: 300 } } as const;
const CATEGORY_FETCH_OPTIONS = { next: { revalidate: 3600 } } as const;

function toPositiveInteger(value: number | undefined, fallback: number): number {
  if (!value || Number.isNaN(value) || value < 1) return fallback;
  return Math.floor(value);
}

function buildProductsUrl(params: GetProductsParams): string {
  const page = toPositiveInteger(params.page, 1);
  const limit = toPositiveInteger(params.limit, ITEMS_PER_PAGE);
  const skip = (page - 1) * limit;
  const queryParams = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (params.q) {
    queryParams.set('q', params.q);
    return `${API_BASE_URL}/products/search?${queryParams.toString()}`;
  }

  if (params.category) {
    return `${API_BASE_URL}/products/category/${encodeURIComponent(
      params.category
    )}?${queryParams.toString()}`;
  }

  return `${API_BASE_URL}/products?${queryParams.toString()}`;
}

function productMatchesQuery(product: Product, query: string): boolean {
  const normalizedQuery = query.toLowerCase();

  return [
    product.title,
    product.description,
    product.brand,
    product.category,
  ].some((value) => value?.toLowerCase().includes(normalizedQuery));
}

function sortProducts(products: Product[], sort: string | undefined): Product[] {
  const sorted = [...products];

  switch (sort) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'featured':
    default:
      return sorted;
  }
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductsResponse> {
  if (params.q && params.category) {
    const page = toPositiveInteger(params.page, 1);
    const limit = toPositiveInteger(params.limit, ITEMS_PER_PAGE);
    const skip = (page - 1) * limit;
    const response = await fetch(
      `${API_BASE_URL}/products/category/${encodeURIComponent(
        params.category
      )}?limit=100&skip=0`,
      PRODUCT_FETCH_OPTIONS
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = (await response.json()) as ProductsResponse;
    const filteredProducts = sortProducts(
      data.products.filter((product) => productMatchesQuery(product, params.q ?? '')),
      params.sort
    );

    return {
      products: filteredProducts.slice(skip, skip + limit),
      total: filteredProducts.length,
      skip,
      limit,
    };
  }

  const response = await fetch(buildProductsUrl(params), PRODUCT_FETCH_OPTIONS);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = (await response.json()) as ProductsResponse;

  return {
    ...data,
    products: sortProducts(data.products, params.sort),
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
    ...PRODUCT_FETCH_OPTIONS,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return (await response.json()) as Product;
}

export async function getProductCategories(): Promise<CategoryType[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/category-list`,
    CATEGORY_FETCH_OPTIONS
  );

  if (!response.ok) {
    throw new Error('Failed to fetch product categories');
  }

  return (await response.json()) as CategoryType[];
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const related = await getProducts({
    category: product.category,
    limit: RELATED_PRODUCTS_LIMIT + 1,
  });

  return related.products
    .filter((relatedProduct) => relatedProduct.id !== product.id)
    .slice(0, RELATED_PRODUCTS_LIMIT);
}
