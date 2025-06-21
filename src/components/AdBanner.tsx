
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  className?: string;
  type?: 'horizontal' | 'vertical';
}

export const AdBanner: React.FC<AdBannerProps> = ({ className, type = 'horizontal' }) => {
  const horizontalClasses = 'h-24 w-full md:h-28';
  const verticalClasses = 'w-full min-h-[250px] md:min-h-[300px]';

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg border border-dashed bg-muted/50 text-muted-foreground',
        type === 'horizontal' ? horizontalClasses : verticalClasses,
        className
      )}
    >
      <span className="text-sm">Advertisement</span>
    </div>
  );
};
