import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hoverEffect = true,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-[2rem] p-6 overflow-hidden",
        hoverEffect && "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent z-0" />
    </div>
  );
};

export default GlassCard;
