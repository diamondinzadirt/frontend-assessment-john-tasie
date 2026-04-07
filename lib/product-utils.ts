import { Product } from './types';
import { ITEMS_PER_PAGE, MAX_VISIBLE_PAGES } from './constants';

/**
 * Filter products by category
 */
export function filterByCategory(products: Product[], category: string): Product[] {
  if (!category) return products;
  return products.filter((product) => product.category === category);
}

/**
 * Sort products based on sort option
 */
export function sortProducts(
  products: Product[],
  sortBy: string
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
    case 'featured':
    default:
      return sorted;
  }
}

/**
 * Paginate products with limit and offset
 */
export function paginateProducts(
  products: Product[],
  page: number
): { items: Product[]; totalPages: number; currentPage: number; hasMore: boolean } {
  const currentPage = Math.max(1, page);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const validPage = Math.min(currentPage, Math.max(1, totalPages));

  const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const items = products.slice(startIdx, endIdx);

  return { 
    items, 
    totalPages, 
    currentPage: validPage,
    hasMore: validPage < totalPages
  };
}

/**
 * Get visible page numbers for pagination UI
 */
export function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisible: number = MAX_VISIBLE_PAGES
): number[] {
  const pages: number[] = [];
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}
