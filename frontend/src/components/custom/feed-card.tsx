import React, { useState } from 'react';
import { Heart, ChatCircle, Repeat, Star, DotsThree, Info, CaretRight } from '@phosphor-icons/react';

export type FeedCardType =
  | 'review'
  | 'post'
  | 'repost_only'
  | 'repost_with_comment'
  | 'rated'
  | 'watched'
  | 'session';

export interface EmbeddedMovieInfo {
  title: string;
  posterUrl: string;
  director?: string; // e.g. "Gakuryu Ishii"
  detailsLine?: string; // e.g. "Drama · 2024 · 1h45"
}

export interface QuotedReviewInfo {
  name: string; // e.g. "Lothrik Junior"
  actionText?: string; // e.g. "avaliou Duna: Parte II"
  timeAgo: string; // e.g. "há 2 horas"
  rating?: number; // e.g. 5
  avatarUrl: string;
  content: string; // e.g. "Uma obra épica que supera o original..."
}

export interface SharedSessionInfo {
  title: string;
  posterUrl: string;
  ageRating?: 'L' | '10' | '12' | '14' | '16' | '18';
  detailsLine?: string; // e.g. "Drama · 2024 · 1h45"
  cinemaAndRoom?: string; // e.g. "Cinesystem Arapiraca - Sala 4"
  dateLabel?: string; // e.g. "SEX 27/03"
  time?: string; // e.g. "19:00"
  audioFormat?: string; // e.g. "DUB"
  screenFormat?: string; // e.g. "IMAX"
}

export interface FeedCardProps {
  id?: string;
  type?: FeedCardType;
  name: string; // e.g. "Lothrik Junior"
  handle?: string; // e.g. "@lothrik"
  avatarUrl: string;
  timeAgo: string; // e.g. "há 2 horas"
  actionText?: string; // e.g. "avaliou Duna: Parte II", "assistiu Duna: Parte II", "compartilhou uma sessão"
  repostHeaderText?: string; // e.g. "repostou uma review"
  rating?: number; // e.g. 5 (renders 5 pink stars)
  embeddedMovie?: EmbeddedMovieInfo;
  quotedReview?: QuotedReviewInfo;
  sharedSession?: SharedSessionInfo;
  content?: string;
  likesCount?: number;
  commentsCount?: number;
  repostsCount?: number;
  isLikedInitial?: boolean;
  showActionBar?: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  type = 'post',
  name,
  handle,
  avatarUrl,
  timeAgo,
  actionText,
  repostHeaderText,
  rating,
  embeddedMovie,
  quotedReview,
  sharedSession,
  content,
  likesCount = 42,
  commentsCount = 42,
  repostsCount = 42,
  isLikedInitial = true,
  showActionBar,
}) => {
  const [isLiked, setIsLiked] = useState(isLikedInitial);
  const [likes, setLikes] = useState(likesCount);

  const isRatedOrWatched = type === 'rated' || type === 'watched';
  const shouldShowActionBar = showActionBar !== undefined ? showActionBar : !isRatedOrWatched;

  const toggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  const formattedHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : null;

  return (
    <div className="w-full border-4 border-foreground/40 bg-background p-5 sm:p-6 font-display shadow-[6px_6px_0px_0px_var(--border)] text-foreground space-y-3.5">
      
      {/* 0. Top Repost Header (For Repost Only) */}
      {(type === 'repost_only' || repostHeaderText) && (
        <div className="flex items-center gap-2 pb-2.5 border-b-2 border-foreground/20 text-xs font-bold text-foreground/70">
          <Repeat size={18} weight="bold" className="text-foreground/50" />
          <img
            src={avatarUrl}
            alt={name}
            className="w-6 h-6 object-cover border border-foreground/40 shrink-0"
          />
          <span className="font-black text-foreground">{name}</span>
          <span className="text-foreground/50">{repostHeaderText || 'repostou uma review'}</span>
        </div>
      )}

      {/* 1. Top Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar (Square) */}
          <img
            src={avatarUrl}
            alt={name}
            className="w-11 h-11 sm:w-12 sm:h-12 object-cover border-2 border-foreground/40 shrink-0"
          />

          <div>
            <div className="flex items-center gap-1.5 flex-wrap text-sm sm:text-base font-black text-foreground">
              <span>{name}</span>
              {actionText ? (
                <span className="font-bold text-foreground/60">
                  {actionText}
                </span>
              ) : formattedHandle ? (
                <span className="font-bold text-foreground/50 text-xs sm:text-sm">
                  {formattedHandle}
                </span>
              ) : null}
            </div>

            <span className="block text-xs font-bold text-foreground/40 mt-0.5">
              {timeAgo}
            </span>
          </div>
        </div>

        {/* Optional Star Rating (Pink Stars) */}
        {rating !== undefined && (
          <div className="flex items-center gap-1 text-[#FF5C80]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                weight={star <= rating ? 'fill' : 'bold'}
                className={star <= rating ? 'text-[#FF5C80]' : 'text-foreground/30'}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Reposter's / Shared Comment Text */}
      {content && (
        <p className="text-xs sm:text-sm font-bold text-foreground/80 leading-relaxed">
          {content}
        </p>
      )}

      {/* 3. Shared Session Card Box (For Repost Session) */}
      {sharedSession && (
        <div className="p-4 border-2 border-foreground/30 bg-foreground/5 flex gap-4 items-center">
          {/* Poster Container with Age Rating */}
          <div className="relative shrink-0">
            <img
              src={sharedSession.posterUrl}
              alt={sharedSession.title}
              className="w-16 h-24 object-cover border-2 border-foreground/40"
            />
            {sharedSession.ageRating && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-[#34A853] text-white flex items-center justify-center text-[9px] font-black">
                {sharedSession.ageRating}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between min-w-0 flex-1 space-y-1">
            <div>
              <h4 className="text-sm sm:text-base font-black uppercase text-foreground leading-tight truncate">
                {sharedSession.title}
              </h4>
              {sharedSession.detailsLine && (
                <p className="text-[11px] font-bold text-foreground/50 mt-0.5">
                  {sharedSession.detailsLine}
                </p>
              )}
              {sharedSession.cinemaAndRoom && (
                <p className="text-[11px] font-bold text-foreground/70 mt-0.5">
                  {sharedSession.cinemaAndRoom}
                </p>
              )}

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                {sharedSession.dateLabel && (
                  <span className="bg-[#6A1B4D] text-white px-2 py-0.5 text-[10px] font-black uppercase">
                    {sharedSession.dateLabel}
                  </span>
                )}
                {sharedSession.time && (
                  <span className="border border-foreground/40 text-foreground px-2 py-0.5 text-[10px] font-extrabold uppercase">
                    {sharedSession.time}
                  </span>
                )}
                {sharedSession.audioFormat && (
                  <span className="border border-foreground/40 text-foreground px-2 py-0.5 text-[10px] font-extrabold uppercase">
                    {sharedSession.audioFormat}
                  </span>
                )}
                {sharedSession.screenFormat && (
                  <span className="border border-foreground/40 text-foreground px-2 py-0.5 text-[10px] font-extrabold uppercase">
                    {sharedSession.screenFormat}
                  </span>
                )}
              </div>
            </div>

            <button className="flex items-center gap-0.5 text-[11px] font-black text-[#FF5C80] hover:underline cursor-pointer pt-1 w-fit">
              <span>Ver sessão</span>
              <CaretRight size={12} weight="bold" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Embedded Quoted Review Box */}
      {quotedReview && (
        <div className="p-4 border-2 border-foreground/30 bg-foreground/5 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={quotedReview.avatarUrl}
                alt={quotedReview.name}
                className="w-8 h-8 object-cover border border-foreground/40 shrink-0"
              />
              <div className="text-xs">
                <span className="font-black text-foreground">{quotedReview.name}</span>
                {quotedReview.actionText && (
                  <span className="font-bold text-foreground/60 ml-1">{quotedReview.actionText}</span>
                )}
                <span className="block text-[10px] font-bold text-foreground/40">{quotedReview.timeAgo}</span>
              </div>
            </div>

            {quotedReview.rating !== undefined && (
              <div className="flex items-center gap-0.5 text-[#FF5C80]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    weight={star <= quotedReview.rating! ? 'fill' : 'bold'}
                    className={star <= quotedReview.rating! ? 'text-[#FF5C80]' : 'text-foreground/30'}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="text-xs font-bold text-foreground/75 leading-relaxed line-clamp-2">
            {quotedReview.content}
          </p>
        </div>
      )}

      {/* 5. Embedded Movie Box (For Standard Review, Rated, Watched) */}
      {embeddedMovie && (
        <div className="p-4 border-2 border-foreground/30 bg-foreground/5 flex gap-4 items-center">
          <img
            src={embeddedMovie.posterUrl}
            alt={embeddedMovie.title}
            className="w-16 h-24 object-cover border-2 border-foreground/40 shrink-0"
          />
          <div className="flex flex-col justify-between min-w-0 flex-1">
            <div>
              <h4 className="text-sm sm:text-base font-black uppercase text-foreground leading-tight truncate">
                {embeddedMovie.title}
              </h4>
              {embeddedMovie.director && (
                <p className="text-xs font-bold text-[#FF5C80] mt-0.5">
                  Dir. {embeddedMovie.director}
                </p>
              )}
              {embeddedMovie.detailsLine && (
                <p className="text-[11px] font-bold text-foreground/50 mt-0.5">
                  {embeddedMovie.detailsLine}
                </p>
              )}
            </div>

            <button className="flex items-center gap-1 text-[11px] font-extrabold text-foreground/60 hover:text-primary cursor-pointer mt-2 w-fit">
              <Info size={14} />
              <span>Ver Detalhes</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Divider & Bottom Action Bar (Only rendered if shouldShowActionBar is true) */}
      {shouldShowActionBar && (
        <>
          <div className="border-b-2 border-foreground/20" />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4 text-xs font-black">
              {/* Like Action */}
              <button
                type="button"
                onClick={toggleLike}
                className="flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Heart
                  size={18}
                  weight={isLiked ? 'fill' : 'bold'}
                  className={isLiked ? 'text-[#FF5C80]' : 'text-foreground/50'}
                />
                <span className={isLiked ? 'text-[#FF5C80]' : 'text-foreground/50'}>
                  {likes}
                </span>
              </button>

              {/* Comment Action */}
              <div className="flex items-center gap-1.5 text-foreground/50">
                <ChatCircle size={18} weight="bold" />
                <span>{commentsCount}</span>
              </div>

              {/* Repost Action */}
              <div className="flex items-center gap-1.5 text-foreground/50">
                <Repeat size={18} weight="bold" />
                <span>{repostsCount}</span>
              </div>
            </div>

            {/* More Actions Menu */}
            <button
              type="button"
              className="text-foreground/40 hover:text-foreground cursor-pointer transition-colors"
              title="Opções"
            >
              <DotsThree size={24} weight="bold" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
