import type { Stone, UserProgress } from '@/types/domain';
import { UNLOCK_RULE } from '@/config/constants';

/**
 * Determines if the next stone should be unlocked based on current stone completion
 * @param stoneId - The current stone ID
 * @param completedIds - Array of completed challenge IDs
 * @param stoneMap - Map of stone ID to Stone object
 * @returns true if next stone should be unlocked
 */
export function shouldUnlockNextStone(
  stoneId: string,
  completedIds: string[],
  stoneMap: Record<string, Stone>
): boolean {
  const stone = stoneMap[stoneId];
  if (!stone) {
    return false;
  }

  const challengeIds = stone.challengeIds;
  const completedInStone = challengeIds.filter(id => completedIds.includes(id));
  
  return completedInStone.length >= UNLOCK_RULE.MIN_COMPLETED_FOR_UNLOCK;
}

/**
 * Gets the next stone ID in sequence
 * @param currentStoneId - The current stone ID
 * @param stoneMap - Map of stone ID to Stone object
 * @returns next stone ID or null if no next stone
 */
export function getNextStoneId(
  currentStoneId: string,
  stoneMap: Record<string, Stone>
): string | null {
  const stones = Object.values(stoneMap).sort((a, b) => a.order - b.order);
  const currentIndex = stones.findIndex(stone => stone.id === currentStoneId);
  
  if (currentIndex === -1 || currentIndex >= stones.length - 1) {
    return null;
  }
  
  return stones[currentIndex + 1]?.id ?? null;
}

/**
 * Applies unlock logic to user progress
 * @param progress - Current user progress
 * @param nextStoneId - Next stone ID to unlock (can be null)
 * @returns updated user progress
 */
export function applyUnlock(progress: UserProgress, nextStoneId: string | null): UserProgress {
  if (!nextStoneId) {
    return progress;
  }
  
  if (progress.unlockedStoneIds.includes(nextStoneId)) {
    return progress;
  }
  
  return {
    ...progress,
    unlockedStoneIds: [...progress.unlockedStoneIds, nextStoneId],
  };
}