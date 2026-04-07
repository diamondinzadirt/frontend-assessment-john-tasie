import { MAX_VISIBLE_PAGES } from '@/lib/constants';

export function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisible: number = MAX_VISIBLE_PAGES
): number[] {
  const pages: number[] = [];
  const halfVisible = Math.floor(maxVisible / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push(-1);
  }

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push(-1);
    pages.push(totalPages);
  }

  return pages;
}
