'use client';

import { useState } from 'react';
import { FALLBACK_IMAGE } from '@/lib/constants';

interface ProductImageGalleryProps {
  thumbnail: string;
  title: string;
}

export function ProductImageGallery({
  thumbnail,
  title,
}: ProductImageGalleryProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage = imageError ? FALLBACK_IMAGE : thumbnail;

  return (
    <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
    </div>
  );
}
