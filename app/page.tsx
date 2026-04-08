import { Suspense } from 'react';
import { Search } from '@/features/search-filter/search';
import { Filters } from '@/features/search-filter/filters';
import {
  FiltersSkeleton,
  ProductListingSkeleton,
  SearchSkeleton,
} from '@/features/products/listing/product-listing-skeleton';
import { ProductListing } from '@/features/products/listing/product-listing';
import {
  normalizeListingSearchParams,
  type RawSearchParams,
} from '@/features/products/listing/search-params';
import { getProductCategories } from '@/lib/products';

interface PageProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const rawSearchParams = await searchParams;
  let categoryLoadError = false;
  let categories: Awaited<ReturnType<typeof getProductCategories>> = [];

  try {
    categories = await getProductCategories();
  } catch {
    categoryLoadError = true;
  }

  const { productParams, urlParams } =
    normalizeListingSearchParams(rawSearchParams);

  return (
    <main id="main-content" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Checkit Product Explorer
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

        <div className="mb-6 lg:hidden">
          <Suspense fallback={<FiltersSkeleton variant="compact" />}>
            <Filters
              categories={categories}
              categoryLoadError={categoryLoadError}
              variant="compact"
            />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside
            className="hidden lg:block lg:col-span-1"
            aria-label="Product filters"
          >
            <div className="sticky top-8">
              <Suspense fallback={<FiltersSkeleton />}>
                <Filters
                  categories={categories}
                  categoryLoadError={categoryLoadError}
                />
              </Suspense>
            </div>
          </aside>

          {/* Main - Products Grid */}
          <section
            id="product-results"
            className="lg:col-span-3"
            aria-labelledby="products-heading"
          >
            <h2 id="products-heading" className="sr-only">
              Product results
            </h2>
            <Suspense fallback={<ProductListingSkeleton />}>
              <ProductListing
                params={productParams}
                searchParams={urlParams}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
