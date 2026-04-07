import Link from 'next/link';

import { getVisiblePages } from './pagination-utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

function createPageHref(
  page: number,
  searchParams: Record<string, string | undefined>
): string {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  params.set('page', page.toString());

  return `/?${params.toString()}`;
}

export function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <Link
        href={createPageHref(Math.max(1, currentPage - 1), searchParams)}
        aria-disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg border ${
          currentPage === 1
            ? 'border-gray-200 text-gray-400 pointer-events-none'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        ← Previous
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === -1) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-500">
                …
              </span>
            );
          }

          return (
            <Link
              key={page}
              href={createPageHref(page, searchParams)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`w-10 h-10 rounded-lg border transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } inline-flex items-center justify-center`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      <Link
        href={createPageHref(Math.min(totalPages, currentPage + 1), searchParams)}
        aria-disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg border ${
          currentPage === totalPages
            ? 'border-gray-200 text-gray-400 pointer-events-none'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Next →
      </Link>
    </div>
  );
}
