"use client"

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <DotLottieReact
        src="https://lottie.host/c32d7276-1756-482e-adfc-1bb52744d971/Jsgd4vGiFX.lottie"
        loop
        autoplay
        className={sizeClasses[size]}
      />
    </div>
  );
};

export default LoadingSpinner; 