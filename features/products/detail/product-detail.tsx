import Link from 'next/link';
import { Suspense } from 'react';
import { Breadcrumb } from '@/components/breadcrumb';
import { ErrorState } from '@/components/error-state';
import { ProductCard } from '@/components/product-card';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { RatingDisplay } from '@/components/rating-display';
import { StockBadge } from '@/components/stock-badge';
import { getRelatedProducts } from '@/lib/products';
import type { Product } from '@/types';

function getCategoryHref(category: string): string {
  const params = new URLSearchParams({ category });
  return `/?${params.toString()}`;
}

async function RelatedProducts({ product }: { product: Product }) {
  let relatedProducts: Product[] = [];
  let relatedProductsError = false;

  try {
    relatedProducts = await getRelatedProducts(product);
  } catch {
    relatedProductsError = true;
  }

  if (relatedProductsError) {
    return (
      <ErrorState
        title="Related products could not be loaded"
        message="The main product is available, but related products are temporarily unavailable."
        actionHref="/"
        actionLabel="Browse all products"
      />
    );
  }

  if (relatedProducts.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductsFallback() {
  return (
    <section aria-label="Loading related products">
      <div className="h-8 w-48 rounded bg-gray-200 animate-pulse mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: product.category, href: getCategoryHref(product.category) },
          { label: product.title },
        ]}
      />

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
        {/* Image Gallery */}
        <div>
          <ProductImageGallery
            thumbnail={product.thumbnail}
            title={product.title}
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
          />
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
            By <span className="font-semibold">{product.brand ?? 'Unknown Brand'}</span>
          </p>

          {/* Rating */}
          <div className="mb-6">
            <RatingDisplay
              rating={product.rating}
              reviewCount={product.reviews.length}
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
              <span className="font-medium text-gray-900">
                {product.brand ?? 'Unknown Brand'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Stock</span>
              <span className="font-medium text-gray-900">{product.stock}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Add to Cart
            </button>
            <Link
              href="/"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <Suspense fallback={<RelatedProductsFallback />}>
        <RelatedProducts product={product} />
      </Suspense>
    </div>
  );
}
