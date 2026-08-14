import React from 'react';

interface TooltipErrorProps {
  message?: string;
}

export const TooltipError: React.FC<TooltipErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="absolute right-2 top-full mt-1 z-30 bg-background border-2 border-foreground/40 px-2.5 py-1 text-[12px] font-sans text-destructive font-black tracking-wide shadow-[3px_3px_0px_0px_var(--border)] animate-in fade-in slide-in-from-top-1 duration-150 whitespace-nowrap pointer-events-none">
      <div className="absolute -top-[5px] right-4 w-2 h-2 bg-background border-t-2 border-l-2 border-foreground/40 rotate-45 text-foreground/60" />
      {message}
    </div>
  );
};
