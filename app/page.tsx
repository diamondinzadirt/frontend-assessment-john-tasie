'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { Search } from '@/components/search';
import { Filters } from '@/components/filters';
import { ProductCard } from '@/components/product-card';
import { ProductSkeleton } from '@/components/product-skeleton';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import {
  filterByCategory,
  sortProducts,
  paginateProducts,
} from '@/lib/product-utils';
import { fetchProducts } from '@/lib/api';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function ProductsGrid() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'featured';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <ProductsGridSkeleton />;
  }

  // Apply filters
  let filteredProducts = filterByCategory(products, category);
  filteredProducts = sortProducts(filteredProducts, sort);

  // Paginate results
  const { items, totalPages, currentPage } = paginateProducts(filteredProducts, page);

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
    </div>
  );
}

function SearchSkeleton() {
  return <div className="mb-6 h-11 w-full rounded-lg bg-gray-200 animate-pulse" />;
}

function FiltersSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
      <div className="space-y-2">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-gray-200 animate-pulse" />
          ))}
      </div>
      <div className="h-px bg-gray-200" />
      <div className="h-5 w-20 rounded bg-gray-200 animate-pulse" />
      <div className="space-y-2">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-gray-200 animate-pulse" />
          ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Explorer
          </h1>
          <p className="text-gray-600">
            Browse our collection of premium products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Suspense fallback={<SearchSkeleton />}>
          <Search />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <Suspense fallback={<FiltersSkeleton />}>
                <Filters />
              </Suspense>
            </div>
          </aside>

          {/* Main - Products Grid */}
          <section className="lg:col-span-3">
            <Suspense fallback={<ProductsGridSkeleton />}>
              <ProductsGrid />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
