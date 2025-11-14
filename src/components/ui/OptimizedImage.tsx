// Optimized Image component using Next.js Image

'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Skeleton } from '@/components/shared/Skeletons';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton
          width={width}
          height={height}
          rounded
          className="absolute inset-0 z-10"
        />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
