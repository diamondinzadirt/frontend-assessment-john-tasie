import { ITEMS_PER_PAGE, RELATED_PRODUCTS_LIMIT } from './constants';
import type {
  CategoryType,
  GetProductsParams,
  Product,
  ProductsResponse,
} from '@/types';

const API_BASE_URL = 'https://dummyjson.com';

type NextFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

const PRODUCT_FETCH_OPTIONS: NextFetchOptions = { next: { revalidate: 300 } };
const CATEGORY_FETCH_OPTIONS: NextFetchOptions = { next: { revalidate: 3600 } };

export class ProductApiError extends Error {
  readonly status?: number;
  readonly cause?: unknown;

  constructor(message: string, options: { status?: number; cause?: unknown } = {}) {
    super(message);
    this.name = 'ProductApiError';
    this.status = options.status;
    this.cause = options.cause;
  }
}

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

export function sortProducts(products: Product[], sort: string | undefined): Product[] {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isProductReview(value: unknown): boolean {
  if (!isRecord(value)) return false;

  return (
    typeof value.rating === 'number' &&
    typeof value.comment === 'string' &&
    typeof value.date === 'string' &&
    typeof value.reviewerName === 'string' &&
    typeof value.reviewerEmail === 'string'
  );
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.category === 'string' &&
    typeof value.price === 'number' &&
    typeof value.discountPercentage === 'number' &&
    typeof value.rating === 'number' &&
    typeof value.stock === 'number' &&
    isStringArray(value.tags) &&
    (value.brand === undefined || typeof value.brand === 'string') &&
    typeof value.sku === 'string' &&
    typeof value.weight === 'number' &&
    isRecord(value.dimensions) &&
    typeof value.dimensions.width === 'number' &&
    typeof value.dimensions.height === 'number' &&
    typeof value.dimensions.depth === 'number' &&
    typeof value.warrantyInformation === 'string' &&
    typeof value.shippingInformation === 'string' &&
    typeof value.availabilityStatus === 'string' &&
    Array.isArray(value.reviews) &&
    value.reviews.every(isProductReview) &&
    typeof value.returnPolicy === 'string' &&
    typeof value.minimumOrderQuantity === 'number' &&
    isStringArray(value.images) &&
    typeof value.thumbnail === 'string'
  );
}

function isProductsResponse(value: unknown): value is ProductsResponse {
  if (!isRecord(value)) return false;

  return (
    Array.isArray(value.products) &&
    value.products.every(isProduct) &&
    typeof value.total === 'number' &&
    typeof value.skip === 'number' &&
    typeof value.limit === 'number'
  );
}

function isCategoryList(value: unknown): value is CategoryType[] {
  return isStringArray(value);
}

async function parseJsonResponse(response: Response, errorMessage: string): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    throw new ProductApiError(errorMessage, {
      status: response.status,
      cause: error,
    });
  }
}

async function fetchJson(
  url: string,
  init: NextFetchOptions,
  errorMessage: string
): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new ProductApiError(errorMessage, { cause: error });
  }

  if (!response.ok) {
    throw new ProductApiError(errorMessage, { status: response.status });
  }

  return parseJsonResponse(response, errorMessage);
}

function assertProductsResponse(value: unknown): ProductsResponse {
  if (!isProductsResponse(value)) {
    throw new ProductApiError('Received invalid product list data');
  }

  return value;
}

function assertProduct(value: unknown): Product {
  if (!isProduct(value)) {
    throw new ProductApiError('Received invalid product data');
  }

  return value;
}

function assertCategoryList(value: unknown): CategoryType[] {
  if (!isCategoryList(value)) {
    throw new ProductApiError('Received invalid category data');
  }

  return value;
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductsResponse> {
  if (params.q && params.category) {
    const page = toPositiveInteger(params.page, 1);
    const limit = toPositiveInteger(params.limit, ITEMS_PER_PAGE);
    const skip = (page - 1) * limit;

    // DummyJSON does not expose a combined category+search endpoint.
    // Fetch the category first, then apply the search query at the API boundary.
    const data = assertProductsResponse(
      await fetchJson(
        `${API_BASE_URL}/products/category/${encodeURIComponent(
          params.category
        )}?limit=100&skip=0`,
        PRODUCT_FETCH_OPTIONS,
        'Failed to fetch products'
      )
    );
    const filteredProducts = sortProducts(
      data.products.filter((product) =>
        productMatchesQuery(product, params.q ?? '')
      ),
      params.sort
    );

    return {
      products: filteredProducts.slice(skip, skip + limit),
      total: filteredProducts.length,
      skip,
      limit,
    };
  }

  const data = assertProductsResponse(
    await fetchJson(
      buildProductsUrl(params),
      PRODUCT_FETCH_OPTIONS,
      'Failed to fetch products'
    )
  );

  return {
    ...data,
    products: sortProducts(data.products, params.sort),
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      ...PRODUCT_FETCH_OPTIONS,
    });
  } catch (error) {
    throw new ProductApiError('Failed to fetch product', { cause: error });
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new ProductApiError('Failed to fetch product', { status: response.status });
  }

  return assertProduct(await parseJsonResponse(response, 'Failed to fetch product'));
}

export async function getProductCategories(): Promise<CategoryType[]> {
  return assertCategoryList(
    await fetchJson(
      `${API_BASE_URL}/products/category-list`,
      CATEGORY_FETCH_OPTIONS,
      'Failed to fetch product categories'
    )
  );
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
