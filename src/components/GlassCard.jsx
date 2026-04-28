import React from 'react';
import { cn } from '../logic/utils';

const GlassCard = ({ children, className, premium = false }) => {
  return (
    <div className={cn(
      "rounded-3xl p-6 transition-all duration-300",
      premium ? "glass-premium" : "glass",
      className
    )}>
      {children}
    </div>
  );
};

export default GlassCard;
