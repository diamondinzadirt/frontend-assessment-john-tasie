import { ProductSkeleton } from '@/components/product-skeleton';

export function ProductListingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array(20)
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

export function FiltersSkeleton({
  variant = 'sidebar',
}: {
  variant?: 'sidebar' | 'compact';
}) {
  if (variant === 'compact') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-40 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="h-8 w-14 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                <div className="h-11 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            ))}
        </div>
      </div>
    );
  }

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
