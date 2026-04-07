import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/breadcrumb';
import { ProductCard } from '@/components/product-card';
import { RatingDisplay } from '@/components/rating-display';
import { StockBadge } from '@/components/stock-badge';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { ProductDetailSkeleton } from '@/components/product-detail-skeleton';
import { fetchProductById, getRelatedProducts } from '@/lib/api';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function ProductDetail({ id }: { id: string }) {
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(id);

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: product.category, href: `/?category=${product.category}` },
          { label: product.title },
        ]}
      />

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
        {/* Image Gallery */}
        <div>
          <ProductImageGallery thumbnail={product.thumbnail} title={product.title} />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category */}
          <span className="inline-block text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded w-fit mb-4">
            {product.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          {/* Brand */}
          <p className="text-gray-600 mb-4">
            By <span className="font-semibold">{product.brand}</span>
          </p>

          {/* Rating */}
          <div className="mb-6">
            <RatingDisplay 
              rating={product.rating} 
              reviewCount={product.reviewCount}
              size="lg"
              showCount={true}
            />
          </div>

          {/* Divider */}
          <hr className="my-6" />

          {/* Price */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Price</p>
            <p className="text-4xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Stock Status */}
          <div className="mb-8">
            <StockBadge quantity={product.stock} size="md" showQuantity={true} />
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-600">Category</span>
              <span className="font-medium text-gray-900">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Brand</span>
              <span className="font-medium text-gray-900">{product.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Stock</span>
              <span className="font-medium text-gray-900">{product.stock}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Add to Cart
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function Page({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Products
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetail id={id} />
        </Suspense>
      </div>
    </main>
  );
}
