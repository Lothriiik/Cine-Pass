import React from 'react';

export interface CinemaTicketProps {
  id?: string;
  movieTitle: string;
  cinemaName: string;
  roomName: string;
  seats: string[];
  date: string;
  time: string;
  ticketType?: 'standard' | 'vip' | 'used' | 'cancelled';
  price?: number;
  ticketCategory?: string; // e.g. "2x Inteira - 2x Meia"
  audioFormat?: string; // e.g. "DUB", "LEG"
  screenFormat?: string; // e.g. "IMAX", "2D", "3D"
  code?: string;
}

export const CinemaTicket: React.FC<CinemaTicketProps> = ({
  cinemaName,
  movieTitle,
  roomName,
  seats,
  date,
  time,
  ticketType = 'standard',
  price = 109.0,
  ticketCategory = '2x Inteira - 2x Meia',
  audioFormat = 'DUB',
  screenFormat = 'IMAX',
  code = '#SKR-20260327-4891',
}) => {
  const isVip = ticketType === 'vip';
  const isUsed = ticketType === 'used';
  const isCancelled = ticketType === 'cancelled';

  // Dynamic colors for the header block matching the 4 Figma tickets
  const headerBg = isCancelled
    ? 'bg-[#E8857C]' // Light Coral / Salmon Red
    : isUsed
    ? 'bg-[#8D7B75]' // Taupe / Warm Grey
    : isVip
    ? 'bg-[#6A1B4D]' // Dark Wine
    : 'bg-[#1E2B45]'; // Dark Navy (Standard)

  // Status Badge in the footer
  const statusBadge = isCancelled ? (
    <span className="border-2 border-[#E8857C] bg-[#E8857C]/10 text-[#E8857C] px-3 py-0.5 text-[11px] font-black uppercase">
      CANCELADO
    </span>
  ) : isUsed ? (
    <span className="border-2 border-[#8D7B75] bg-[#8D7B75]/10 text-[#8D7B75] px-3 py-0.5 text-[11px] font-black uppercase">
      UTILIZADO
    </span>
  ) : (
    <span className="border-2 border-[#34A853] bg-[#34A853]/10 text-[#34A853] px-3 py-0.5 text-[11px] font-black uppercase">
      ATIVO
    </span>
  );

  return (
    <div className="w-full max-w-[320px] sm:max-w-[340px] rounded-none border-4 border-foreground/40 bg-background font-display shadow-[6px_6px_0px_0px_var(--border)] overflow-hidden text-foreground">
      
      {/* 1. Header Block (Top Colored Area) */}
      <div className={`${headerBg} p-5 text-white space-y-2 border-b-4 border-foreground/40`}>
        <span className="block text-[10px] font-extrabold uppercase tracking-widest opacity-70">
          {cinemaName}
        </span>
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
          {movieTitle}
        </h3>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="bg-[#FF5C80] text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
            {date} - {time}
          </span>
          {audioFormat && (
            <span className="border border-white/40 text-white px-2 py-0.5 text-[10px] font-extrabold uppercase">
              {audioFormat}
            </span>
          )}
          {screenFormat && (
            <span className="border border-white/40 text-white px-2 py-0.5 text-[10px] font-extrabold uppercase">
              {screenFormat}
            </span>
          )}
        </div>
      </div>

      {/* 2. Middle Details (2x2 Grid) */}
      <div className="p-5 space-y-4 text-xs font-bold text-foreground/80">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block text-[10px] font-extrabold uppercase text-foreground/40 mb-0.5">SALA</span>
            <span className="font-extrabold text-foreground text-xs sm:text-sm">{roomName}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold uppercase text-foreground/40 mb-0.5">ASSENTOS</span>
            <span className="font-extrabold text-foreground text-xs sm:text-sm">{seats.join(', ')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <span className="block text-[10px] font-extrabold uppercase text-foreground/40 mb-0.5">TIPO</span>
            <span className="font-extrabold text-foreground text-xs sm:text-sm">{ticketCategory}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold uppercase text-foreground/40 mb-0.5">TOTAL</span>
            <span className="font-black text-[#FF5C80] text-xs sm:text-sm">R$ {price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Dashed Separator Line */}
      <div className="border-b-2 border-dashed border-foreground/30 mx-5" />

      {/* 3. Footer Stub Section (QR Code & Status) */}
      <div className="p-5 flex items-center gap-4">
        {/* QR Code / Color Block */}
        <div
          className={`w-16 h-16 shrink-0 border-2 border-foreground/40 ${
            isCancelled ? 'bg-[#E8857C]' : isUsed ? 'bg-[#8D7B75]' : 'bg-black'
          }`}
        />

        <div className="flex flex-col items-start gap-1">
          {statusBadge}
          <span className="text-[10px] font-mono font-extrabold text-foreground/50 tracking-wider">
            {code}
          </span>
        </div>
      </div>

    </div>
  );
};
