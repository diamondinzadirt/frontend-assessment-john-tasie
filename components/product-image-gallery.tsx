'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FALLBACK_IMAGE } from '@/lib/constants';

interface ProductImageGalleryProps {
  thumbnail: string;
  title: string;
  priority?: boolean;
  sizes?: string;
}

export function ProductImageGallery({
  thumbnail,
  title,
  priority = false,
  sizes = '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
}: ProductImageGalleryProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(true);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const displayImage = imageError ? FALLBACK_IMAGE : thumbnail;

  return (
    <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
      <div className="aspect-square relative">
        {isLoading && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200"
          />
        )}
        <Image
          key={displayImage}
          src={displayImage}
          alt={title}
          width={600}
          height={600}
          sizes={sizes}
          priority={priority}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    </div>
  );
}
