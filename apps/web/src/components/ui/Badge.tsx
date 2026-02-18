import React from 'react';
import { cn } from '@/lib/utils';

const colorStyles = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  gray: 'bg-gray-50 text-gray-700 border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

interface BadgeProps {
  children: React.ReactNode;
  color?: keyof typeof colorStyles;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorStyles[color],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
