import React from 'react';
import { TrendUp, TrendDown } from '@phosphor-icons/react';

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  isPositive = true,
}) => {
  return (
    <div className="flex flex-col p-4 sm:p-5 border-4 border-foreground/40 bg-background font-display shadow-[4px_4px_0px_0px_var(--border)]">
      <span className="text-xs font-extrabold uppercase text-foreground/50">{title}</span>
      <div className="flex items-baseline justify-between mt-2">
        <span className="text-2xl sm:text-3xl font-black text-foreground">{value}</span>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-black ${isPositive ? 'text-emerald-500' : 'text-destructive'}`}>
            {isPositive ? <TrendUp size={16} weight="bold" /> : <TrendDown size={16} weight="bold" />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};
