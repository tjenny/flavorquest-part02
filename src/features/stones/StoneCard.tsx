import type { Stone, Challenge } from '@/types/domain';

interface StoneCardProps {
  stone: Stone;
  challenges: Challenge[];
  onChallengeClick?: (challengeId: string) => void;
}

export function StoneCard({ stone, challenges, onChallengeClick }: StoneCardProps) {
  const stoneChallenges = challenges.filter(c => c.stoneId === stone.id);
  const isUnlocked = stone.unlocked ?? false;
  const isCompleted = stone.completed ?? false;
  
  return (
    <div className={`
      p-6 rounded-lg border-2 transition-all duration-200
      ${isUnlocked 
        ? 'border-green-400 bg-green-50 hover:bg-green-100' 
        : 'border-gray-300 bg-gray-50'
      }
      ${isCompleted ? 'border-blue-400 bg-blue-50' : ''}
    `}>
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-3xl">{stone.emoji}</span>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{stone.name}</h3>
          <p className="text-sm text-gray-600">{stone.theme}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {stoneChallenges.map(challenge => (
          <button
            key={challenge.id}
            onClick={() => onChallengeClick?.(challenge.id)}
            disabled={!isUnlocked}
            className={`
              w-full p-3 text-left rounded-md transition-colors
              ${isUnlocked 
                ? 'bg-white hover:bg-gray-50 border border-gray-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{challenge.title}</span>
              <span className="text-sm text-gray-500">{challenge.points} pts</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
