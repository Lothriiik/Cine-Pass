import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

export interface CarouselProps {
  children: React.ReactNode;
  title?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full font-display space-y-3">
      <div className="flex items-center justify-between">
        {title && <h3 className="text-base font-extrabold uppercase text-foreground">{title}</h3>}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={scrollLeft} aria-label="Anterior">
            <ChevronLeft size={20} className="stroke-[3]" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} aria-label="Próximo">
            <ChevronRight size={20} className="stroke-[3]" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto scrollbar-none py-2 scroll-smooth"
      >
        {children}
      </div>
    </div>
  );
};
