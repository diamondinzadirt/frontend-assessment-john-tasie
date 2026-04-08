'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS } from '@/lib/constants';
import type { CategoryType } from '@/types';

interface FiltersProps {
  categories: CategoryType[];
  categoryLoadError?: boolean;
  onFilterChange?: () => void;
  variant?: 'sidebar' | 'compact';
}

function getCategoryLabel(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function Filters({
  categories,
  categoryLoadError = false,
  onFilterChange,
  variant = 'sidebar',
}: FiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'featured';
  const hasActiveFilters = Boolean(selectedCategory) || sortBy !== 'featured';

  const navigateWithParams = (params: URLSearchParams) => {
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(nextUrl, { scroll: false });
    onFilterChange?.();
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
      params.set('page', '1');
    } else {
      params.delete('category');
      params.delete('page');
    }
    navigateWithParams(params);
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    if (sort !== 'featured') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    params.set('page', '1');
    navigateWithParams(params);
  };

  if (variant === 'compact') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Filter products</h2>
            <p className="text-xs text-gray-500">Choose a category or sort order</p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('category');
                params.delete('sort');
                params.delete('page');
                navigateWithParams(params);
              }}
              className="rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Reset
            </button>
          )}
        </div>

        {categoryLoadError && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800"
          >
            Categories are temporarily unavailable. Search and sorting still work.
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="mobile-category-filter"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="mobile-category-filter"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={categoryLoadError}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="mobile-sort-filter"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sort by
            </label>
            <select
              id="mobile-sort-filter"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Category Filter */}
      <section aria-labelledby="category-filter-heading">
        <h2 id="category-filter-heading" className="font-semibold text-gray-900 mb-3">
          Category
        </h2>
        {categoryLoadError && (
          <p
            role="status"
            className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800"
          >
            Categories are temporarily unavailable. Search and sorting still work.
          </p>
        )}
        <div className="space-y-2" role="group" aria-labelledby="category-filter-heading">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            aria-pressed={!selectedCategory}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              !selectedCategory
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              aria-pressed={selectedCategory === category}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                selectedCategory === category
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </section>

      {/* Sort Filter */}
      <section className="border-t border-gray-200 pt-6" aria-labelledby="sort-filter-heading">
        <h2 id="sort-filter-heading" className="font-semibold text-gray-900 mb-3">
          Sort By
        </h2>
        <div className="space-y-2" role="group" aria-labelledby="sort-filter-heading">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSortChange(option.value)}
              aria-pressed={sortBy === option.value}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                sortBy === option.value
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
