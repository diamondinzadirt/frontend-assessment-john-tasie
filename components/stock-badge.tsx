'use client';

import { STOCK_STATUS, STOCK_THRESHOLDS } from '@/lib/constants';

interface StockBadgeProps {
  quantity: number;
  size?: 'sm' | 'md';
  showQuantity?: boolean;
}

export function StockBadge({
  quantity,
  size = 'md',
  showQuantity = false,
}: StockBadgeProps) {
  const isOutOfStock = quantity === 0;
  const isLowStock = quantity > 0 && quantity <= STOCK_THRESHOLDS.LOW;
  const isInStock = quantity > STOCK_THRESHOLDS.LOW;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  if (isOutOfStock) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-red-100 text-red-700 font-medium`}
      >
        Out of Stock
      </div>
    );
  }

  if (isLowStock) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-amber-100 text-amber-700 font-medium`}
      >
        {showQuantity ? `Only ${quantity} left` : 'Low Stock'}
      </div>
    );
  }

  if (isInStock) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-green-100 text-green-700 font-medium`}
      >
        {showQuantity ? `${quantity} in stock` : 'In Stock'}
      </div>
    );
  }

  return null;
}
