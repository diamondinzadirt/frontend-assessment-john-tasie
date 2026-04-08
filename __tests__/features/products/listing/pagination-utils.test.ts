import { describe, expect, it } from 'vitest';
import { getVisiblePages } from '@/features/products/listing/pagination-utils';

describe('getVisiblePages', () => {
  it('returns all pages when the total fits in the visible window', () => {
    expect(getVisiblePages(1, 3)).toEqual([1, 2, 3]);
  });

  it('adds ellipsis markers around the current page window', () => {
    expect(getVisiblePages(5, 10, 3)).toEqual([1, -1, 4, 5, 6, -1, 10]);
  });
});
