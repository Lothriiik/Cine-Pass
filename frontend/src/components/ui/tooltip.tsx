import React from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block font-display">
      {children}
      <div
        className={`absolute ${positionClasses[position]} hidden group-hover:block z-50 whitespace-nowrap bg-background border-4 border-foreground/40 px-2.5 py-1 text-xs font-black text-foreground/60 shadow-[3px_3px_0px_0px_var(--border)] animate-in fade-in zoom-in-95 pointer-events-none`}
      >
        {content}
      </div>
    </div>
  );
};
