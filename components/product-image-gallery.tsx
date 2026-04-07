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

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage = imageError ? FALLBACK_IMAGE : thumbnail;

  return (
    <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={displayImage}
          alt={title}
          width={600}
          height={600}
          sizes={sizes}
          priority={priority}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
    </div>
  );
}
