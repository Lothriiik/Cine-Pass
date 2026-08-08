import React from 'react';
import { Button } from '../ui/button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-none border-4 border-dashed border-foreground/30 bg-background/50 font-display">
      {icon && (
        <div className="mb-4 p-4 border-4 border-foreground/20 bg-background text-primary">
          {icon}
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-xs sm:text-sm font-bold text-foreground/60 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="default"
          size="sm"
          className="mt-6"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
