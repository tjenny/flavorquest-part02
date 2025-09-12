import { useMemo } from 'react';
import type { AppUser } from '@/types/domain';
import { getCurrentUser } from '@/data/mockRepo';

/**
 * Hook that always returns a user object (never undefined)
 * For demo purposes, returns the first demo user
 */
export function useCurrentUser(): AppUser {
  return useMemo(() => {
    try {
      return getCurrentUser();
    } catch (error) {
      console.error('FQ: Failed to get current user:', error);
      // Fallback demo user
      return {
        id: 'demo',
        displayName: 'Demo User',
        isDemo: true,
        dietary: [],
        progress: {
          userId: 'demo',
          unlockedStoneIds: ['stone1'],
          completedChallengeIds: [],
          points: 0,
        },
      };
    }
  }, []);
}
