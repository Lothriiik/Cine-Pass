import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from '@phosphor-icons/react';

export type MovieTagType = 'none' | 'pre_sale' | 'release' | 're_release';

export interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  rating?: number;
  duration?: string; // e.g. "1h57", "1h39"
  genre?: string;    // e.g. "CRIME", "DRAMA", "ANIMATION", "ACTION", "ROMANCE"
  ageRating?: 'L' | '10' | '12' | '14' | '16' | '18';
  tagType?: MovieTagType; // 'pre_sale' | 'release' | 're_release'
  eventLabel?: string;    // e.g. "ESTREIA 08/04", "REEXIBIÇÃO 08/04", "ESTREIA"
  isPreSale?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterUrl,
  rating,
  duration = '1h57',
  genre = 'DRAMA',
  ageRating = 'L',
  tagType = 'none',
  eventLabel,
  isPreSale = false,
}) => {
  const isPreSaleActive = isPreSale || tagType === 'pre_sale';
  const isReRelease = tagType === 're_release';

  // Age Rating Badge Colors matching Figma
  const ageRatingBg =
    ageRating === 'L'
      ? 'bg-[#34A853]'
      : ageRating === '18'
      ? 'bg-[#DC3545]'
      : ageRating === '16'
      ? 'bg-[#FF9900]'
      : ageRating === '14'
      ? 'bg-[#D4A338]'
      : 'bg-[#3B82F6]';

  return (
    <Link
      to={`/movies/${id}`}
      className={`group relative flex flex-col rounded-none border-4 font-display transition-all hover:-translate-y-1 shadow-[6px_6px_0px_0px_var(--border)] overflow-hidden bg-background ${
        isPreSaleActive
          ? 'border-[#FF5C80] shadow-[6px_6px_0px_0px_#FF5C80]'
          : 'border-foreground/40 hover:border-primary'
      }`}
    >
      {/* 1. Poster Image Container */}
      <div className="relative aspect-[2/3] w-full bg-foreground/10 overflow-hidden">
        <img
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Right Age Rating Badge (Square) */}
        {ageRating && (
          <div
            className={`absolute top-2 right-2 z-10 w-5 h-5 flex items-center justify-center text-[10px] font-black text-white ${ageRatingBg}`}
          >
            {ageRating}
          </div>
        )}

        {/* Bottom Poster Overlay Badge for PRÉ-VENDA */}
        {isPreSaleActive && (
          <div className="absolute bottom-0 inset-x-0 bg-black/90 text-[#FF5C80] text-center py-1 text-[10px] font-black uppercase tracking-widest border-t-2 border-[#FF5C80]">
            PRÉ-VENDA
          </div>
        )}
      </div>

      {/* 2. Sub-Bar Event Label (ESTREIA 08/04, REEXIBIÇÃO 08/04, etc.) */}
      {(eventLabel || isPreSaleActive || isReRelease) && (
        <div
          className={`py-1 text-center text-[10px] font-black uppercase tracking-wider border-t-2 border-b-2 ${
            isPreSaleActive
              ? 'bg-background text-[#FF5C80] border-[#FF5C80]'
              : isReRelease
              ? 'bg-[#1E2B45] text-white border-[#1E2B45]'
              : 'bg-[#594242]/10 text-[#6A1B4D] border-[#6A1B4D]/40'
          }`}
        >
          {eventLabel || (isReRelease ? 'REEXIBIÇÃO' : 'ESTREIA')}
        </div>
      )}

      {/* 3. Movie Title & Meta Information */}
      <div className="flex flex-col p-3 border-t-2 border-foreground/40 bg-background justify-between flex-1 space-y-2">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Footer Meta Row (Genre, Duration, Rating) */}
        <div className="flex items-center justify-between text-[10px] font-bold text-foreground/60 pt-1 border-t border-foreground/10">
          <div className="flex items-center gap-1.5">
            <span className="border border-foreground/40 px-1.5 py-0.5 text-[9px] font-extrabold text-foreground uppercase">
              {genre}
            </span>
            <span>{duration}</span>
          </div>

          {rating !== undefined && (
            <div className="flex items-center gap-1 text-primary font-black text-xs">
              <Star size={14} weight="bold" className="text-primary" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
