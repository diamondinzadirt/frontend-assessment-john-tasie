import { ITEMS_PER_PAGE } from '@/lib/constants';
import type { GetProductsParams } from '@/types';

export type RawSearchParams = Record<string, string | string[] | undefined>;

export interface NormalizedListingSearchParams {
  productParams: GetProductsParams;
  urlParams: Record<string, string | undefined>;
}

function getSearchParam(
  params: RawSearchParams,
  key: string
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function toPage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function normalizeListingSearchParams(
  params: RawSearchParams
): NormalizedListingSearchParams {
  const q = getSearchParam(params, 'q')?.trim() || undefined;
  const category = getSearchParam(params, 'category') || undefined;
  const sort = getSearchParam(params, 'sort') || 'featured';
  const page = toPage(getSearchParam(params, 'page'));

  return {
    productParams: {
      q,
      category,
      sort,
      page,
      limit: ITEMS_PER_PAGE,
    },
    urlParams: {
      q,
      category,
      sort: sort === 'featured' ? undefined : sort,
      page: String(page),
    },
  };
}
