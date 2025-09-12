import React from 'react';
import { Check, Lock } from 'lucide-react';
import type { Stone } from '@/types/domain';
import { cn } from '@/lib/utils';

interface SteppingStoneProps {
  stone: Stone;
  isUnlocked: boolean;
  isCompleted: boolean;
  onClick: () => void;
  index: number;
}

const SteppingStone: React.FC<SteppingStoneProps> = ({
  stone,
  isUnlocked,
  isCompleted,
  onClick,
  index,
}) => {
  const getStoneState = () => {
    if (isCompleted) return 'completed';
    if (isUnlocked) return 'available';
    return 'locked';
  };

  const state = getStoneState();

  return (
    <div className="flex flex-col items-center relative">
      {/* Connecting Line (not for first stone) */}
      {index > 0 && (
        <div className="absolute -top-8 w-0.5 h-8 bg-gradient-to-b from-muted to-border" />
      )}
      
      {/* Dotted line before stone */}
      {index > 0 && (
        <div className="absolute -top-16 w-0.5 h-8">
          <div className="w-full h-full border-l-2 border-dotted border-muted-foreground/30" />
        </div>
      )}

      {/* Stone Button */}
      <button
        onClick={onClick}
        disabled={!isUnlocked}
        className={cn(
          "relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 transition-all duration-300 group",
          "flex items-center justify-center text-2xl md:text-3xl font-bold",
          "focus:outline-none focus:ring-4 focus:ring-primary/50",
          {
            // Completed state
            "bg-gradient-to-br from-green-400 to-green-600 border-green-300 shadow-glow": state === 'completed',
            "hover:shadow-xl hover:scale-105": state === 'completed',
            
            // Available state  
            "bg-gradient-to-br": state === 'available',
            "border-white/50 shadow-challenge animate-pulse": state === 'available',
            "hover:shadow-glow hover:scale-110 cursor-pointer": state === 'available',
            
            // Locked state
            "bg-muted border-muted-foreground/20 text-muted-foreground": state === 'locked',
            "cursor-not-allowed": state === 'locked',
          },
          state === 'available' && stone.color
        )}
        style={{
          background: state === 'available' ? `linear-gradient(135deg, ${stone.color.replace('from-', '').replace(' to-', ', ')})` : undefined
        }}
      >
        {state === 'completed' ? (
          <Check className="w-8 h-8 md:w-10 md:h-10 text-white" />
        ) : state === 'locked' ? (
          <Lock className="w-6 h-6 md:w-8 md:h-8" />
        ) : (
          <span className="text-white drop-shadow-lg">{stone.emoji}</span>
        )}

        {/* Glow effect for available stones */}
        {state === 'available' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>

      {/* Stone Title */}
      <div className="mt-4 text-center max-w-32">
        <h3 className={cn(
          "font-semibold text-sm md:text-base",
          {
            "text-green-600": state === 'completed',
            "text-foreground": state === 'available',
            "text-muted-foreground": state === 'locked',
          }
        )}>
          {stone.title}
        </h3>
        
        {/* Progress indicator */}
        <div className="mt-2 flex justify-center">
          <div className={cn(
            "text-xs px-2 py-1 rounded-full",
            {
              "bg-green-100 text-green-700": state === 'completed',
              "bg-primary/10 text-primary": state === 'available',
              "bg-muted text-muted-foreground": state === 'locked',
            }
          )}>
            {state === 'completed' ? '✓ Complete' : 
             state === 'available' ? '1 of 3 to unlock' : 
             'Locked'}
          </div>
        </div>
      </div>

      {/* Connecting Line to next stone */}
      {index < 3 && (
        <div className="mt-8 w-0.5 h-8 bg-gradient-to-b from-border to-muted" />
      )}
    </div>
  );
};

export default SteppingStone;