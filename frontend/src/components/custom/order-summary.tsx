import React from 'react';
import { Info } from '@phosphor-icons/react';

export interface OrderItem {
  label: string;
  price: number;
}

export interface OrderSummaryProps {
  movieTitle?: string;
  moviePoster?: string;
  cinemaName?: string;
  cinemaLocation?: string;
  sessionRoomTime?: string;
  seats?: string[];
  items?: OrderItem[];
  subtotal?: number;
  serviceFee?: number;
  totalPrice?: number;
  ratingBadge?: string;
  formatBadges?: string[];
  showTimer?: boolean;
  timerSeconds?: number;
  onConfirm?: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  movieTitle = 'Angel Dust',
  moviePoster = 'https://image.tmdb.org/t/p/w500/1pdfLPoLMag8St8vRyTFiTJvMGE.jpg',
  cinemaName = 'Cinesystem Arapiraca',
  cinemaLocation = 'Arapiraca / AL',
  sessionRoomTime = 'Sala 5 · Sex 27/03 · 19:00',
  seats = ['D7', 'D8'],
  items = [
    { label: '1x Inteira', price: 30.0 },
    { label: '1x Inteira', price: 30.0 },
    { label: '1x Inteira', price: 30.0 },
    { label: '1x Inteira', price: 30.0 },
    { label: '1x Inteira', price: 30.0 },
    { label: '1x Inteira', price: 30.0 },
  ],
  subtotal = 104.0,
  serviceFee = 5.0,
  totalPrice = 109.0,
  ratingBadge = 'L',
  formatBadges = ['IMAX', 'LEGENDADO'],
  showTimer = false,
  timerSeconds = 452,
}) => {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="w-full max-w-[340px] sm:max-w-[360px] rounded-none border-4 border-foreground/40 bg-background font-display shadow-[6px_6px_0px_0px_var(--border)] overflow-hidden text-foreground">
      
      {/* Top Banner Header when showTimer is true */}
      {showTimer ? (
        <div className="bg-[#1E2B45] text-white p-4 border-b-4 border-foreground/40 flex items-center justify-between">
          {/* Animated Circular Ring */}
          <div className="relative w-11 h-11 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#FF5C80]"
                strokeDasharray="75, 100"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>

          <div className="text-right">
            <span className="block text-xl font-black text-[#FF5C80] leading-none">{formattedTime}</span>
            <span className="text-[10px] font-extrabold opacity-60 tracking-wider">restantes para concluir</span>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b-4 border-foreground/40">
          <h3 className="text-lg font-black uppercase text-foreground">Resumo do Pedido</h3>
        </div>
      )}

      {/* Movie Details Header */}
      <div className="p-4 sm:p-5 flex gap-4 border-b-2 border-foreground/30">
        <img
          src={moviePoster}
          alt={movieTitle}
          className="w-20 h-28 object-cover border-2 border-foreground/40 shrink-0"
        />

        <div className="flex flex-col justify-between min-w-0 flex-1">
          <div>
            <h4 className="text-base font-black uppercase text-foreground leading-snug line-clamp-1">
              {movieTitle}
            </h4>

            {/* Rating and Format Badges */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="bg-[#34A853] text-white px-1.5 py-0.5 text-[10px] font-black uppercase">
                {ratingBadge}
              </span>
              {formatBadges.map((b, i) => (
                <span key={i} className="border border-foreground/40 text-foreground/70 px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                  {b}
                </span>
              ))}
            </div>

            <div className="mt-2">
              <span className="block text-xs font-extrabold text-foreground">{cinemaName}</span>
              <span className="block text-[10px] font-bold text-foreground/50">{cinemaLocation}</span>
            </div>
          </div>

          <button className="flex items-center gap-1 text-[11px] font-extrabold text-foreground/60 hover:text-primary cursor-pointer mt-1">
            <Info size={14} />
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>

      {/* Session Details Row */}
      <div className="px-5 py-3 border-b-2 border-foreground/30 flex items-center justify-between text-xs font-bold">
        <span className="text-foreground/50 uppercase font-extrabold">Sessão</span>
        <span className="font-extrabold text-foreground">{sessionRoomTime}</span>
      </div>

      {/* Seats Row */}
      <div className="px-5 py-3 border-b-2 border-foreground/30 flex items-center justify-between text-xs font-bold">
        <span className="text-foreground/50 uppercase font-extrabold">Assentos</span>
        <span className="font-extrabold text-foreground">{seats.join(', ')}</span>
      </div>

      {/* Itemized Pricing Section */}
      <div className="p-5 border-b-2 border-foreground/30 space-y-2 text-xs font-bold">
        <span className="block text-foreground/50 uppercase font-extrabold mb-1">Itens</span>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-foreground">
            <span className="font-extrabold">{item.label}</span>
            <span className="font-black">R$ {item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Subtotal Row */}
      <div className="px-5 py-3 border-b-2 border-foreground/30 flex items-center justify-between text-xs font-bold">
        <span className="text-foreground/50 uppercase font-extrabold">Subtotal</span>
        <span className="font-black text-foreground">R$ {subtotal.toFixed(2)}</span>
      </div>

      {/* Taxa Row */}
      <div className="px-5 py-3 border-b-2 border-foreground/30 flex items-center justify-between text-xs font-bold">
        <span className="text-foreground/50 uppercase font-extrabold">Taxa</span>
        <span className="font-black text-foreground">R$ {serviceFee.toFixed(2)}</span>
      </div>

      {/* Total Row (Wine / Pink highlighted price) */}
      <div className="p-5 flex items-center justify-between text-sm sm:text-base font-black">
        <span className="uppercase text-foreground">Total</span>
        <span className="text-xl sm:text-2xl font-black text-[#FF5C80]">
          R$ {totalPrice.toFixed(2)}
        </span>
      </div>

    </div>
  );
};
