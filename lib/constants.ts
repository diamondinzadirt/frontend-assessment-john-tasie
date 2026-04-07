// Pagination
export const ITEMS_PER_PAGE = 12;
export const MAX_VISIBLE_PAGES = 5;

// Sorting
export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
] as const;

// Stock status
export const STOCK_STATUS = {
  IN_STOCK: 'in-stock',
  LOW_STOCK: 'low-stock',
  OUT_OF_STOCK: 'out-of-stock',
} as const;

export const STOCK_THRESHOLDS = {
  LOW: 10,
} as const;

// Rating
export const MIN_RATING = 0;
export const MAX_RATING = 5;

// Product details
export const RELATED_PRODUCTS_LIMIT = 3;
export const FALLBACK_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%236b7280" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';

// Messages
export const EMPTY_STATE_MESSAGE = 'No products found. Try adjusting your search or filters.';
export const ERROR_STATE_MESSAGE = 'Something went wrong. Please try again.';
