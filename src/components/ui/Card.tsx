import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'borderless';
  hoverEffect?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'glass', hoverEffect = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl transition-all duration-200',
          variant === 'glass' && 'glass-panel shadow-md',
          variant === 'solid' && 'bg-bg-secondary border border-border shadow-md',
          variant === 'borderless' && 'bg-transparent',
          hoverEffect && variant !== 'borderless' && 'glass-panel-hover',
          props.onClick && 'cursor-pointer active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
