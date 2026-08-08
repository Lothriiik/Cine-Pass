import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselSlide {
  id: string;
  title: string;
  badge?: string; // e.g. "ESTREIA"
  logoUrl?: string; // e.g. Speed Racer logo PNG
  backdropUrl: string;
  category: string; // e.g. "Cinema - 2h56 - Ação Aventura"
  ageRating?: 'L' | '10' | '12' | '14' | '16' | '18';
  directors: string[]; // e.g. ["Lana Wachowski", "Lilly Wachowski"]
  synopsis: string;
  ticketLink?: string;
}

export interface HeroCarouselProps {
  slides: CarouselSlide[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!slides || slides.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentIndex];
  const prevSlide = slides[currentIndex === 0 ? slides.length - 1 : currentIndex - 1];
  const nextSlide = slides[currentIndex === slides.length - 1 ? 0 : currentIndex + 1];

  const getAgeRatingBg = (rating?: string) => {
    if (rating === 'L') return 'bg-[#34A853]';
    if (rating === '18') return 'bg-[#DC3545]';
    if (rating === '16') return 'bg-[#FF9900]';
    if (rating === '14') return 'bg-[#D4A338]';
    return 'bg-[#3B82F6]';
  };

  return (
    <div className="w-full font-display space-y-4 select-none">
      {/* 1. Main Carousel Stage (Left Peek | Center Stage | Right Peek) */}
      <div className="relative flex items-center justify-center overflow-hidden py-4">
        
        {/* Left Side Peeking Slide */}
        <div
          onClick={handlePrev}
          className="hidden md:block w-1/5 aspect-[16/9] lg:aspect-[21/9] shrink-0 opacity-40 hover:opacity-75 transition-opacity cursor-pointer border-4 border-foreground/30 relative overflow-hidden mr-4"
        >
          <img
            src={prevSlide.backdropUrl}
            alt={prevSlide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="w-10 h-12 bg-black/70 border-2 border-white/50 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} className="stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Center Main Active Slide */}
        <div className="w-full md:w-3/5 aspect-[16/9] sm:aspect-[21/9] shrink-0 border-4 border-foreground/40 bg-background shadow-[8px_8px_0px_0px_var(--border)] relative overflow-hidden">
          {/* Backdrop Image */}
          <img
            src={currentSlide.backdropUrl}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center"
          />

          {/* Left Gradient Overlay & Information Panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent p-5 sm:p-8 flex flex-col justify-between w-full md:w-3/5 h-full text-white">
            {/* Top Badge */}
            <div>
              <span className="inline-block border border-[#FF5C80] text-[#FF5C80] px-3 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-widest bg-black/40">
                {currentSlide.badge || 'ESTREIA'}
              </span>
            </div>

            {/* Title / Logo Area */}
            <div className="my-2 space-y-2">
              {currentSlide.logoUrl ? (
                <img
                  src={currentSlide.logoUrl}
                  alt={currentSlide.title}
                  className="max-h-16 sm:max-h-20 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                />
              ) : (
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md">
                  {currentSlide.title}
                </h2>
              )}

              {/* Meta Category & Rating */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-white/90">
                <span>{currentSlide.category}</span>
                {currentSlide.ageRating && (
                  <span
                    className={`w-4 h-4 flex items-center justify-center text-[9px] font-black text-white ${getAgeRatingBg(
                      currentSlide.ageRating
                    )}`}
                  >
                    {currentSlide.ageRating}
                  </span>
                )}
              </div>

              {/* Directors */}
              {currentSlide.directors && currentSlide.directors.length > 0 && (
                <p className="text-[11px] font-bold text-white/80">
                  Dir.{' '}
                  {currentSlide.directors.map((d, i) => (
                    <span key={i} className="text-[#FF5C80] underline font-extrabold cursor-pointer hover:text-white">
                      {d}{i < currentSlide.directors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              )}

              {/* Synopsis */}
              <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                {currentSlide.synopsis}
              </p>
            </div>

            {/* Ingressos Solid Button CTA */}
            <div>
              <button className="bg-[#6A1B4D] hover:bg-[#80205D] text-white px-6 py-2.5 font-black uppercase text-xs sm:text-sm tracking-wider cursor-pointer shadow-[3px_3px_0px_0px_var(--border)] transition-all">
                INGRESSOS
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Peeking Slide */}
        <div
          onClick={handleNext}
          className="hidden md:block w-1/5 aspect-[16/9] lg:aspect-[21/9] shrink-0 opacity-40 hover:opacity-75 transition-opacity cursor-pointer border-4 border-foreground/30 relative overflow-hidden ml-4"
        >
          <img
            src={nextSlide.backdropUrl}
            alt={nextSlide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="w-10 h-12 bg-black/70 border-2 border-white/50 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer transition-all"
              aria-label="Próximo"
            >
              <ChevronRight size={24} className="stroke-[3]" />
            </button>
          </div>
        </div>

      </div>

      {/* 2. Bottom Indicator Bars (Figma Indicators) */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {slides.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all cursor-pointer ${
                isActive
                  ? 'w-12 h-3 bg-[#6A1B4D] border-2 border-[#6A1B4D]'
                  : 'w-3 h-3 bg-transparent border-2 border-foreground/40 hover:border-primary'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
