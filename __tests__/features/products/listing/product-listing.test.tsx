import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProductsResponse } from '@/types';
import { ProductListing } from '@/features/products/listing/product-listing';

const { getProductsMock } = vi.hoisted(() => ({
  getProductsMock: vi.fn(),
}));

vi.mock('@/lib/products', () => ({
  getProducts: getProductsMock,
}));

vi.mock('@/features/products/listing/pagination', () => ({
  Pagination: () => <nav aria-label="Pagination">Pagination</nav>,
}));

function makeProductsResponse(
  overrides: Partial<ProductsResponse> = {}
): ProductsResponse {
  return {
    products: [],
    total: 0,
    skip: 0,
    limit: 20,
    ...overrides,
  };
}

describe('ProductListing', () => {
  it('renders the empty state when the listing returns no products', async () => {
    getProductsMock.mockResolvedValueOnce(makeProductsResponse());

    render(
      await ProductListing({
        params: { page: 1, limit: 20 },
        searchParams: { page: '1' },
      })
    );

    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(
      screen.getByText(/Try adjusting your search or filters/i)
    ).toBeInTheDocument();
  });

  it('renders a friendly error state when product loading fails', async () => {
    getProductsMock.mockRejectedValueOnce(new Error('API unavailable'));

    render(
      await ProductListing({
        params: { page: 1, limit: 20 },
        searchParams: { page: '1' },
      })
    );

    expect(screen.getByText('Products could not be loaded')).toBeInTheDocument();
    expect(
      screen.getByText(/temporarily unavailable/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Reset listing' })).toBeInTheDocument();
  });
});
