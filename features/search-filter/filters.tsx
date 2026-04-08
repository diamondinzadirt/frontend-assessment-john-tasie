'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS } from '@/lib/constants';
import type { CategoryType } from '@/types';

interface FiltersProps {
  categories: CategoryType[];
  categoryLoadError?: boolean;
  onFilterChange?: () => void;
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
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'featured';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
      params.set('page', '1');
    } else {
      params.delete('category');
      params.delete('page');
    }
    router.push(`?${params.toString()}`);
    onFilterChange?.();
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    if (sort !== 'featured') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
    onFilterChange?.();
  };

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
