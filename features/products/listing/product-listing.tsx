import { EmptyState } from '@/components/empty-state';
import { ProductCard } from '@/components/product-card';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { getProducts } from '@/lib/products';
import type { GetProductsParams } from '@/types';
import { Pagination } from './pagination';

interface ProductListingProps {
  params: GetProductsParams;
  searchParams: Record<string, string | undefined>;
}

export async function ProductListing({
  params,
  searchParams,
}: ProductListingProps) {
  const data = await getProducts(params);
  const currentPage = params.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(data.total / ITEMS_PER_PAGE));

  if (data.products.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {data.products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>
      <Pagination
        currentPage={Math.min(currentPage, totalPages)}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </>
  );
}
