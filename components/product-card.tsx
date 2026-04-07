'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { RatingDisplay } from './rating-display';
import { StockBadge } from './stock-badge';
import { ProductImageGallery } from './product-image-gallery';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group h-full border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col bg-white">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 group-hover:opacity-95 transition-opacity duration-200">
          <ProductImageGallery thumbnail={product.thumbnail} title={product.title} />
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Category Badge */}
          <span className="inline-block text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded w-fit mb-2">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm">
            {product.title}
          </h3>

          {/* Brand */}
          <p className="text-xs text-gray-500 mb-3">
            By {product.brand}
          </p>

          {/* Rating */}
          <div className="mb-3">
            <RatingDisplay
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="sm"
              showCount={false}
            />
          </div>

          {/* Footer - Price and Stock */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
            <StockBadge quantity={product.stock} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}
