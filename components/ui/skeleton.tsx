"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, children, style }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default Skeleton;
