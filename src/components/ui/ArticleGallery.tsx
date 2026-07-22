'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ArticleGalleryProps {
  images: string[];
}

export default function ArticleGallery({ images }: ArticleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <div 
      className="w-full max-w-2xl mx-auto my-12 bg-[#121212] border-4 border-[#c4704b] shadow-[0_0_30px_rgba(196,112,75,0.3)] overflow-hidden group relative rounded-sm"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      <div className="relative aspect-[4/3] md:aspect-video w-full bg-black">
        <div className="absolute inset-4 md:inset-8">
          <Image
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            fill
            unoptimized
            className="!m-0 !border-none !shadow-none object-contain transition-opacity duration-500"
          />
        </div>
        
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
