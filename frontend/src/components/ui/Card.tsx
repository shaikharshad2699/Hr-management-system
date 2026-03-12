import React from 'react';
import { cn } from '@/utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      className={cn('rounded-2xl border border-white/70 bg-white/88 p-4 shadow-[0_20px_45px_-28px_rgba(18,38,31,0.34)] backdrop-blur sm:p-6', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
