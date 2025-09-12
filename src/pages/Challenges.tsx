import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Stone, steppingStones } from '@/data/demoData';
import SteppingStone from '@/components/SteppingStone';
import StoneModal from '@/components/StoneModal';

const Challenges = () => {
  const { currentUser } = useApp();
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);

  if (!currentUser) return null;

  const completedChallengeIds = currentUser.completedChallenges;
  
  // Calculate stone states
  const getStoneState = (stoneIndex: number) => {
    const stone = steppingStones[stoneIndex];
    const completedInStone = stone.challenges.filter(c => 
      completedChallengeIds.includes(c.id)
    ).length;
    
    const isCompleted = completedInStone >= 1;
    const isUnlocked = stoneIndex === 0 || getStoneState(stoneIndex - 1).isCompleted;
    
    return { isCompleted, isUnlocked, completedCount: completedInStone };
  };

  const totalCompleted = steppingStones.reduce((acc, stone) => {
    return acc + stone.challenges.filter(c => completedChallengeIds.includes(c.id)).length;
  }, 0);
  
  const totalStonesCompleted = steppingStones.filter((_, index) => 
    getStoneState(index).isCompleted
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">FlavorQuest Journey</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Follow the stepping stones path through Singapore's culinary adventure
          </p>
          
          {/* Progress Stats */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalCompleted}</div>
              <div className="text-sm text-muted-foreground">Challenges Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{totalStonesCompleted}</div>
              <div className="text-sm text-muted-foreground">Stones Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{currentUser.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
        </div>

        {/* Stepping Stones Path */}
        <div className="flex flex-col items-center space-y-12 md:space-y-16 relative">
          {/* Path Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent rounded-3xl -z-10" />
          
          {steppingStones.map((stone, index) => {
            const state = getStoneState(index);
            return (
              <SteppingStone
                key={stone.id}
                stone={stone}
                isUnlocked={state.isUnlocked}
                isCompleted={state.isCompleted}
                onClick={() => state.isUnlocked && setSelectedStone(stone)}
                index={index}
              />
            );
          })}
        </div>

        {/* Journey Completion Message */}
        {totalStonesCompleted === steppingStones.length && (
          <div className="mt-16 text-center p-8 bg-gradient-primary rounded-2xl text-primary-foreground">
            <h2 className="text-2xl font-bold mb-2">🎉 Journey Complete!</h2>
            <p className="text-primary-foreground/90">
              Congratulations! You've mastered all the stepping stones of Singapore's culinary world.
            </p>
          </div>
        )}
      </div>

      {/* Stone Modal */}
      {selectedStone && (
        <StoneModal 
          stone={selectedStone}
          onClose={() => setSelectedStone(null)}
          completedChallengeIds={completedChallengeIds}
        />
      )}
    </div>
  );
};

export default Challenges;