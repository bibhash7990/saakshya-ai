import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text,
  fullScreen = false,
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const container = fullScreen
    ? 'fixed inset-0 z-50 bg-bg-primary/80 backdrop-blur-sm flex flex-col items-center justify-center'
    : 'w-full py-12 flex flex-col items-center justify-center';

  return (
    <div className={container}>
      <Loader2 className={clsx('animate-spin text-primary-500', sizes[size])} />
      {text && (
        <p className="mt-3 text-xs font-semibold text-text-secondary select-none tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};
