import { useMemo } from 'react';
import type { Stone } from '@/types/domain';
import { stones, CURRENT_PATH_ID } from '@/data/templates';
import { useApp } from '@/contexts/AppContext';

/**
 * Hook to get stones data with user-specific unlock status
 */
export function useStones(): Stone[] {
  const { currentUser } = useApp();
  
  return useMemo(() => {
    if (!currentUser) return stones;
    
    // Update stones with user's actual unlock status
    return stones.map(stone => ({
      ...stone,
      unlocked: currentUser.progress.unlockedStoneIds.includes(stone.id)
    }));
  }, [currentUser?.progress.unlockedStoneIds]);
}

/**
 * Hook to get stones as a map for efficient lookup
 */
export function useStonesMap(): Record<string, Stone> {
  const stonesWithUnlockStatus = useStones();
  
  return useMemo(() => {
    return stonesWithUnlockStatus.reduce((acc, stone) => {
      acc[stone.id] = stone;
      return acc;
    }, {} as Record<string, Stone>);
  }, [stonesWithUnlockStatus]);
}

/**
 * Hook to get challenge-to-stone mapping for efficient lookup
 */
export function useChallengeToStoneMap(): Record<string, string> {
  return useMemo(() => {
    const challengeToStone: Record<string, string> = {};
    stones.forEach(stone => {
      stone.challengeIds.forEach(challengeId => {
        challengeToStone[challengeId] = stone.id;
      });
    });
    return challengeToStone;
  }, []);
}

/**
 * Hook to get stones filtered by current path with user-specific unlock status
 */
export function useStonesForCurrentPath(): Stone[] {
  const { currentUser } = useApp();
  
  return useMemo(() => {
    // Filter stones by current path and preserve existing logic/derivations
    const pathStones = stones
      .filter(s => s.pathId === CURRENT_PATH_ID)
      .sort((a, b) => a.order - b.order);
    
    if (!currentUser) return pathStones;
    
    // Update stones with user's actual unlock status
    return pathStones.map(stone => ({
      ...stone,
      unlocked: currentUser.progress.unlockedStoneIds.includes(stone.id)
    }));
  }, [currentUser?.progress.unlockedStoneIds]);
}