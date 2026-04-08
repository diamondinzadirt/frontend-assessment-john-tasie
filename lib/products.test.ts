import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getProductById,
  getProductCategories,
  getProducts,
  ProductApiError,
} from './products';
import type { Product, ProductsResponse } from '@/types';

function makeProduct(overrides: Partial<Product> = {}): Product {
  const id = overrides.id ?? 1;

  return {
    id,
    title: `Product ${id}`,
    description: `Description for product ${id}`,
    category: 'smartphones',
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 20,
    tags: ['phone'],
    brand: 'Acme',
    sku: `SKU-${id}`,
    weight: 1,
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    warrantyInformation: '1 year warranty',
    shippingInformation: 'Ships in 3 days',
    availabilityStatus: 'In Stock',
    reviews: [],
    returnPolicy: '30 days',
    minimumOrderQuantity: 1,
    images: [`https://cdn.dummyjson.com/product-images/${id}/1.webp`],
    thumbnail: `https://cdn.dummyjson.com/product-images/${id}/thumbnail.webp`,
    ...overrides,
  };
}

function makeProductsResponse(
  products: Product[],
  overrides: Partial<ProductsResponse> = {}
): ProductsResponse {
  return {
    products,
    total: products.length,
    skip: 0,
    limit: products.length,
    ...overrides,
  };
}

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('products API layer', () => {
  it('fetches products through the API boundary and applies local sorting', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        makeProductsResponse([
          makeProduct({ id: 1, price: 300 }),
          makeProduct({ id: 2, price: 100 }),
        ])
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await getProducts({ sort: 'price-low' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=20&skip=0',
      expect.objectContaining({ next: { revalidate: 300 } })
    );
    expect(result.products.map((product) => product.id)).toEqual([2, 1]);
  });

  it('handles the category plus search workaround with filtering and pagination', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        makeProductsResponse([
          makeProduct({
            id: 1,
            title: 'Phone Basic',
            category: 'electronics',
            price: 100,
          }),
          makeProduct({
            id: 2,
            title: 'Phone Pro',
            category: 'electronics',
            price: 200,
          }),
          makeProduct({
            id: 3,
            title: 'Tablet',
            category: 'electronics',
            price: 300,
          }),
        ])
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await getProducts({
      q: 'phone',
      category: 'electronics',
      sort: 'price-high',
      page: 2,
      limit: 1,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/products/category/electronics?limit=100&skip=0',
      expect.objectContaining({ next: { revalidate: 300 } })
    );
    expect(result.products).toHaveLength(1);
    expect(result.products[0]?.title).toBe('Phone Basic');
    expect(result.total).toBe(2);
    expect(result.skip).toBe(1);
    expect(result.limit).toBe(1);
  });

  it('returns null for a missing product detail response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, { status: 404 })));

    await expect(getProductById('999999')).resolves.toBeNull();
  });

  it('throws a typed API error for failed or invalid product list responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ error: 'Server error' }, { status: 500 }))
    );

    await expect(getProducts()).rejects.toBeInstanceOf(ProductApiError);

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ products: [] })));

    await expect(getProducts()).rejects.toThrow('Received invalid product list data');
  });

  it('validates category responses before exposing them to UI code', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(['beauty', 'laptops'])));

    await expect(getProductCategories()).resolves.toEqual(['beauty', 'laptops']);

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([{ slug: 'beauty' }])));

    await expect(getProductCategories()).rejects.toThrow('Received invalid category data');
  });
});
