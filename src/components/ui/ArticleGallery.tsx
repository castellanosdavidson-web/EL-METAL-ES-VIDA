'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface ArticleGalleryProps {
  images: string[];
}

export default function ArticleGallery({ images }: ArticleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full my-8 bg-surface-container-lowest border border-outline-variant/30 overflow-hidden group">
      <div className="relative aspect-video md:aspect-[21/9] w-full bg-black/50">
        <Image
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          unoptimized
          className="object-contain transition-opacity duration-500"
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-white border border-outline-variant hover:bg-primary hover:text-black transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-white border border-outline-variant hover:bg-primary hover:text-black transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
