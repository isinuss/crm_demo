import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

const Card: React.FC<CardProps> = ({ title, children, className, padding = true }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200',
        padding && 'p-6',
        className
      )}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;
