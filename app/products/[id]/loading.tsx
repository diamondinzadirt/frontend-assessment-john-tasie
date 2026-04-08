import { ProductDetailSkeleton } from '@/components/product-detail-skeleton';

export default function Loading() {
  return (
    <main id="main-content" className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailSkeleton />
      </div>
    </main>
  );
}
