import { describe, expect, it } from 'vitest';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { normalizeListingSearchParams } from '@/features/products/listing/search-params';

describe('normalizeListingSearchParams', () => {
  it('trims search input and defaults optional params for shareable URLs', () => {
    const result = normalizeListingSearchParams({ q: '  phone  ' });

    expect(result.productParams).toEqual({
      q: 'phone',
      category: undefined,
      sort: 'featured',
      page: 1,
      limit: ITEMS_PER_PAGE,
    });
    expect(result.urlParams).toEqual({
      q: 'phone',
      category: undefined,
      sort: undefined,
      page: '1',
    });
  });

  it('uses the first URL value and normalizes invalid page input', () => {
    const result = normalizeListingSearchParams({
      q: ['laptop', 'ignored'],
      category: ['laptops', 'smartphones'],
      sort: 'price-high',
      page: '-4',
    });

    expect(result.productParams).toMatchObject({
      q: 'laptop',
      category: 'laptops',
      sort: 'price-high',
      page: 1,
    });
    expect(result.urlParams.sort).toBe('price-high');
  });
});
