import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,  
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, RefreshCw, Wand2, User, Sparkles } from 'lucide-react';
import type { Stone, Challenge } from '@/types/domain';
import { useApp } from '@/contexts/AppContext';
import ChallengeItem from './ChallengeItem';
import ChallengeModal from './ChallengeModal';
import { generateChallenges } from '@/services/aiChallengeGenerator';
import { useToast } from '@/components/ui/use-toast';

interface StoneModalProps {
  stone: Stone;
  onClose: () => void;
  completedChallengeIds: string[];
}

const StoneModal: React.FC<StoneModalProps> = ({ stone, onClose, completedChallengeIds }) => {
  const { currentUser, challenges } = useApp();
  const { toast } = useToast();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [aiChallenges, setAiChallenges] = useState<{
    title: string;
    description: string;
    type: string;
    points: number;
  }[]>([]);

  if (!currentUser) return null;

  // Cache version for invalidating old challenges
  const CACHE_VERSION = '1.0.0';
  
  // Storage key for AI challenge content
  const storageKey = `ai_challenge_${stone.id}_${currentUser.id}`;

  // Load AI challenge content and auto-generate if needed
  useEffect(() => {
    const loadAiChallenge = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          
          // Check if cached version matches current version
          if (parsed.version === CACHE_VERSION && parsed.challenges && Array.isArray(parsed.challenges)) {
            setAiChallenges(parsed.challenges);
            return true;
          } else {
            // Clear old format cache
            console.log('Cache version mismatch, regenerating challenge...');
            localStorage.removeItem(storageKey);
          }
        }
      } catch (error) {
        console.error('Error loading AI challenge:', error);
        // Clear corrupted cache
        localStorage.removeItem(storageKey);
      }
      return false;
    };

    // Auto-generate if no AI challenge exists
    const autoGenerateChallenge = async () => {
      if (loadAiChallenge()) return;
      
      setIsAutoGenerating(true);
      try {
        const generated = await generateChallenges(
          stone.theme,
          currentUser?.dietary || [],
          2 // Generate 2 challenges
        );
        
        const challengeContents = generated.map(challenge => ({
          title: challenge.description, // The dish name (e.g., "Vegetarian Laksa")
          description: challenge.description, // Store just the dish name for formatting later
          type: challenge.type,
          points: challenge.points,
        }));

        setAiChallenges(challengeContents);
        
        // Store with version for cache invalidation
        const cachedData = {
          version: CACHE_VERSION,
          challenges: challengeContents,
          timestamp: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(cachedData));
        
        // Show success toast after a brief delay to let user see the personalization
        setTimeout(() => {
          toast({
            title: "✨ Challenges Personalized!",
            description: `Created 2 personalized challenges for ${currentUser?.name}`,
          });
        }, 1500);
      } catch (error) {
        console.error('Error auto-generating challenge:', error);
      } finally {
        setIsAutoGenerating(false);
      }
    };

    autoGenerateChallenge();
  }, [stone.id, stone.theme, currentUser.id, currentUser.dietary, storageKey]);

  // Create the hybrid challenge list: 2 AI challenges + 1 static challenge (challenge3)
  const getCurrentChallenges = (): Challenge[] => {
    const originalChallenges = challenges.filter(c => c.stoneId === stone.id);
    const challengeList: Challenge[] = [];
    
    // Add AI-generated challenges first (if available)
    if (aiChallenges.length > 0 && originalChallenges.length > 0) {
      // Format the description based on challenge type
      const formatDescription = (type: string, dishName: string) => {
        switch (type) {
          case 'eat':
            return `Try ${dishName}`;
          case 'drink':
            return `Drink ${dishName}`;
          case 'cook':
            return `Cook ${dishName}`;
          default:
            return `Try ${dishName}`;
        }
      };

      // Add first AI challenge (challenge1)
      if (aiChallenges[0] && originalChallenges[0]) {
        challengeList.push({
          ...originalChallenges[0], // Keep original id, image, etc. but override with challenge1 id
          id: `${stone.id}-challenge1`,
          title: aiChallenges[0].description, // Use dish name as title
          description: formatDescription(aiChallenges[0].type, aiChallenges[0].description),
          type: aiChallenges[0].type as 'eat' | 'drink' | 'cook',
          points: aiChallenges[0].points,
          isAIGenerated: true,
        });
      }

      // Add second AI challenge (challenge2)
      if (aiChallenges[1] && originalChallenges[1]) {
        challengeList.push({
          ...originalChallenges[1], // Keep original challenge2 structure
          id: `${stone.id}-challenge2`,
          title: aiChallenges[1].description, // Use dish name as title
          description: formatDescription(aiChallenges[1].type, aiChallenges[1].description),
          type: aiChallenges[1].type as 'eat' | 'drink' | 'cook',
          points: aiChallenges[1].points,
          isAIGenerated: true,
        });
      }
    }
    
    // Add challenge3 (static challenge)
    if (originalChallenges.length >= 3) {
      challengeList.push(originalChallenges[2]); // challenge3
    }
    
    return challengeList;
  };

  const currentChallenges = getCurrentChallenges();
  
  const completedChallenges = currentChallenges.filter(c => 
    completedChallengeIds.includes(c.id)
  );
  
  const availableChallenges = currentChallenges.filter(c => 
    !completedChallengeIds.includes(c.id)
  );

  const completionCount = completedChallenges.length;
  const progressPercentage = (completionCount / currentChallenges.length) * 100;
  const isStoneCompleted = completionCount >= 1;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto mb-4">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${stone.color} flex items-center justify-center text-3xl text-white shadow-lg`}>
                {isStoneCompleted ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  stone.emoji
                )}
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold">{stone.title}</DialogTitle>
            <p className="text-muted-foreground">
              Complete 1 out of 3 challenges to unlock the next stone
            </p>
          </DialogHeader>

          {/* Progress Section */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Progress</span>
              <Badge variant={isStoneCompleted ? "default" : "outline"}>
                {completionCount}/3 challenges
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {isStoneCompleted && (
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Stone unlocked! Next stone is now available.
              </p>
            )}
          </div>

          {/* Auto-generating Loading State */}
          {isAutoGenerating && (
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                <h3 className="font-semibold">Personalizing first challenge...</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Creating 2 personalized challenges for {currentUser?.displayName}
                {currentUser?.dietary && currentUser.dietary.length > 0 && (
                  <span className="ml-1">
                    ({currentUser.dietary.join(', ')})
                  </span>
                )}
              </p>
              {/* Loading skeleton for first challenge */}
              <div className="space-y-3">
                <div className="flex gap-3 p-3 border rounded-lg">
                  <Skeleton className="w-16 h-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Challenge Status */}
          {!isAutoGenerating && aiChallenges.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Personalized Challenges</h3>
                <Badge variant="secondary" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  Tailored for {currentUser?.displayName}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                2 challenges personalized based on your preferences
                {currentUser?.dietary && currentUser.dietary.length > 0 && (
                  <span className="ml-1">
                    ({currentUser.dietary.join(', ')})
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Available Challenges */}
          {availableChallenges.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Available Challenges</h3>
              <div className="space-y-3">
                {availableChallenges.map((challenge) => (
                  <div key={challenge.id} className="relative">
                    <ChallengeItem
                      challenge={challenge}
                      isCompleted={false}
                      onSelect={() => setSelectedChallenge(challenge)}
                    />
                    {challenge.isAIGenerated && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Personalized
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Completed Challenges</h3>
              <div className="space-y-3">
                {completedChallenges.map((challenge) => (
                  <div key={challenge.id} className="relative">
                    <ChallengeItem
                      challenge={challenge}
                      isCompleted={true}
                      onSelect={() => {}} // No action for completed challenges
                    />
                    {challenge.isAIGenerated && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Personalized
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Challenge Modal */}
      {selectedChallenge && (
        <ChallengeModal 
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </>
  );
};

export default StoneModal;