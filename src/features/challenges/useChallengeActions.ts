import { useCallback } from 'react';
import type { Completion, Challenge } from '@/types/domain';
import { getProgress, saveProgress, addCompletion, createPostFromCompletion } from '@/data/mockRepo';
import { shouldUnlockNextStone, getNextStoneId, applyUnlock } from '@/features/stones/unlock';
import { useStonesMap, useChallengeToStoneMap } from '@/features/stones/useStones';
import { POINTS, PENALTIES } from '@/config/constants';

interface CompleteChallengeParams {
  challengeId: string;
  file?: File;
  caption?: string;
  usedAiHint?: boolean;
  userId: string;
  challenges: Challenge[]; // Add challenges parameter
}

/**
 * Hook for challenge-related actions
 */
export function useChallengeActions() {
  const stonesMap = useStonesMap();
  const challengeToStoneMap = useChallengeToStoneMap();

  const completeChallenge = useCallback(async (params: CompleteChallengeParams) => {
    const { challengeId, file, caption, usedAiHint = false, userId, challenges } = params;
    
    try {
      console.log(`FQ: Starting challenge completion for ${challengeId}`);
      
      // Get current progress
      const currentProgress = getProgress(userId);
      
      if (!currentProgress) {
        throw new Error('FQ: No progress found for user');
      }

      // Upload file (stub implementation)
      let photoUrl: string | undefined;
      if (file) {
        // In a real app, this would upload to a service
        photoUrl = `https://fake-upload.com/${file.name}`;
        console.log(`FQ: File uploaded to ${photoUrl}`);
      }

      // Calculate points
      let points = POINTS.BASE_CHALLENGE;
      if (usedAiHint) {
        points = Math.floor(points * (1 - PENALTIES.AI_HINT_PERCENTAGE));
        console.log(`FQ: AI hint penalty applied, points reduced to ${points}`);
      }

      // Create completion record
      const completion: Completion = {
        id: `completion-${Date.now()}`,
        userId,
        challengeId,
        photoUrl,
        caption,
        usedAiHint,
        createdAt: new Date().toISOString(),
      };

      // Add completion to repository
      addCompletion(completion);

      // Update user progress
      const updatedCompletedIds = [...currentProgress.completedChallengeIds, challengeId];
      const updatedPoints = currentProgress.points + points;

      // Check if we should unlock the next stone
      const stoneId = challengeToStoneMap[challengeId];
      console.log(`FQ: Challenge ${challengeId} belongs to stone ${stoneId}`);
      console.log(`FQ: Current progress:`, currentProgress);
      console.log(`FQ: Updated completed IDs:`, updatedCompletedIds);
      
      let updatedProgress = {
        ...currentProgress,
        completedChallengeIds: updatedCompletedIds,
        points: updatedPoints,
      };

      if (stoneId) {
        const shouldUnlock = shouldUnlockNextStone(stoneId, updatedCompletedIds, stonesMap);
        console.log(`FQ: Should unlock next stone? ${shouldUnlock}`);
        if (shouldUnlock) {
          const nextStoneId = getNextStoneId(stoneId, stonesMap);
          console.log(`FQ: Next stone ID: ${nextStoneId}`);
          updatedProgress = applyUnlock(updatedProgress, nextStoneId);
          console.log(`FQ: Next stone unlocked: ${nextStoneId}`);
          console.log(`FQ: Updated progress:`, updatedProgress);
        }
      } else {
        console.log(`FQ: No stone found for challenge ${challengeId}`);
      }

      // Save updated progress
      saveProgress(userId, updatedProgress);

      // Get challenge information for the post
      const challenge = challenges.find(c => c.id === challengeId);
      const challengeTitle = challenge?.title;
      const challengeType = challenge?.type;

      // Create social post from completion
      createPostFromCompletion(completion, challengeTitle, challengeType);

      console.log(`FQ: Challenge ${challengeId} completed successfully`);
      
      return { success: true, completion, updatedProgress };
    } catch (error) {
      console.error('FQ: Error completing challenge:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [stonesMap, challengeToStoneMap]);

  return {
    completeChallenge,
  };
}
