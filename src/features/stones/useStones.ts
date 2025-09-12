import { useMemo } from 'react';
import type { Stone } from '@/types/domain';
import { stones } from '@/data/templates';

/**
 * Hook to get stones data
 */
export function useStones(): Stone[] {
  return useMemo(() => stones, []);
}

/**
 * Hook to get stones as a map for efficient lookup
 */
export function useStonesMap(): Record<string, Stone> {
  return useMemo(() => {
    return stones.reduce((acc, stone) => {
      acc[stone.id] = stone;
      return acc;
    }, {} as Record<string, Stone>);
  }, []);
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
