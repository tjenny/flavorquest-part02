import type { Stone } from '@/types/domain';

interface StonePathProps {
  stones: Stone[];
  currentStoneId?: string;
}

export function StonePath({ stones, currentStoneId }: StonePathProps) {
  const sortedStones = stones.sort((a, b) => a.order - b.order);
  
  return (
    <div className="flex items-center space-x-4">
      {sortedStones.map((stone, index) => {
        const isUnlocked = stone.unlocked ?? false;
        const isCurrent = stone.id === currentStoneId;
        const isCompleted = stone.completed ?? false;
        
        return (
          <div key={stone.id} className="flex items-center">
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-2xl
                ${isUnlocked 
                  ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                  : 'bg-gray-300 text-gray-500'
                }
                ${isCurrent ? 'ring-4 ring-blue-300' : ''}
              `}
            >
              {isCompleted ? '✓' : stone.emoji}
            </div>
            {index < sortedStones.length - 1 && (
              <div className={`w-8 h-1 mx-2 ${isUnlocked ? 'bg-green-400' : 'bg-gray-300'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
