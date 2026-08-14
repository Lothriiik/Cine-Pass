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
      className={`group relative flex flex-col rounded-none border-4 font-display transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden bg-background ${
        isPreSaleActive
          ? 'border-[#FF5C80]'
          : 'border-foreground/40 hover:border-primary'
      }`}
    >
      <div className="relative aspect-[2/3] w-full bg-foreground/10 overflow-hidden">
        <img
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {ageRating && (
          <div
            className={`absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center text-[10px] font-black text-white ${ageRatingBg}`}
          >
            {ageRating}
          </div>
        )}

        {isPreSaleActive && (
          <div className="absolute bottom-0 inset-x-0 bg-foreground/80 text-[#FF5C80] text-center py-1 text-[10px] font-black uppercase tracking-widest border-t-2 border-b-2 border-[#FF5C80]">
            PRÉ-VENDA
          </div>
        )}
      </div>
      
      {(eventLabel || isPreSaleActive || isReRelease) && (
        <div
          className={`py-1 text-center text-[11px] font-black uppercase tracking-wider border-2 ${
            isPreSaleActive
              ? 'bg-foreground/40 text-[#6A1B4D] border-[#6A1B4D]'
              : isReRelease
              ? 'bg-foreground/40 text-[#1E2B45] border-[#1E2B45]'
              : 'bg-foreground/40 text-[#6A1B4D] border-[#6A1B4D]'
          }`}
        >
          {eventLabel || (isReRelease ? 'REEXIBIÇÃO' : 'ESTREIA')}
        </div>
      )}

      <div className="flex flex-col p-3 border-t-2 border-foreground/40 bg-background justify-between flex-1 space-y-2">
        <h3 className="h-8 sm:h-9 min-h-[2rem] sm:min-h-[2.25rem] text-xs sm:text-sm font-extrabold uppercase text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors overflow-hidden">
          {title}
        </h3>

        <div className="flex items-center justify-between text-[10px] font-bold text-foreground/60">
          <div className="flex items-center gap-1.5">
            <span className="border border-foreground/40 bg-foreground/10 px-1.5 py-0.5 text-[10px] font-extrabold text-foreground uppercase">
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
