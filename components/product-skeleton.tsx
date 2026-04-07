export function ProductSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />

        {/* Title lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>

        {/* Brand */}
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />

        {/* Rating */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />

        {/* Price */}
        <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mt-4" />
      </div>
    </div>
  );
}
