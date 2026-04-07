import { ProductSkeleton } from '@/components/product-skeleton';

export function ProductListingSkeleton() {
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

export function SearchSkeleton() {
  return <div className="mb-6 h-11 w-full rounded-lg bg-gray-200 animate-pulse" />;
}

export function FiltersSkeleton() {
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
