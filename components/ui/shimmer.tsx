"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

const Shimmer: React.FC<ShimmerProps> = ({ className, children }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {children}
    </div>
  );
};

export default Shimmer; 