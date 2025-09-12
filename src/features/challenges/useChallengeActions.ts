import { useCallback } from 'react';
import type { Completion, Challenge } from '@/types/domain';
import { getProgress, saveProgress, addCompletion, createPostFromCompletion, getCompletionsByUser } from '@/data/mockRepo';
import { shouldUnlockNextStone, getNextStoneId, applyUnlock } from '@/features/stones/unlock';
import { useStonesMap, useChallengeToStoneMap } from '@/features/stones/useStones';
import { POINTS, PENALTIES } from '@/config/constants';
import { SG_GENERAL_PATH, CHALLENGE_MAP, STONE_MAP } from '@/data/templates';

interface CompleteChallengeParams {
  challengeId: string;
  file?: File;
  caption?: string;
  usedAiHint?: boolean;
  userId: string;
  challenges: Challenge[]; // Add challenges parameter
}

/**
 * Standalone function for completing challenges (can be imported directly)
 */
export async function completeChallengeAction(params: CompleteChallengeParams) {
  const { challengeId, file, caption, usedAiHint = false, userId, challenges } = params;
  
  try {
    console.log(`FQ: Starting challenge completion for ${challengeId}`);
    
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

    // Fetch updated progress + completions
    let progress = getProgress(userId);
    const completions = getCompletionsByUser(userId);
    const completedIds = completions.map(c => c.challengeId);

    const challenge = CHALLENGE_MAP[challengeId];
    
    if (!challenge) {
      console.error(`FQ: Challenge ${challengeId} not found in CHALLENGE_MAP!`);
      throw new Error(`Challenge ${challengeId} not found`);
    }
    
    const currentStoneId = challenge.stoneId;

    // Update progress with new completion
    progress = {
      ...progress,
      completedChallengeIds: completedIds,
      points: progress.points + points,
    };

    // Unlock logic: if 1 of 3 challenges done, unlock next stone
    if (shouldUnlockNextStone(currentStoneId, completedIds, STONE_MAP)) {
      const nextStoneId = getNextStoneId(currentStoneId, STONE_MAP);
      progress = applyUnlock(progress, nextStoneId);
      console.log(`FQ: Next stone unlocked: ${nextStoneId}`);
    }

    // Save updated progress
    saveProgress(userId, progress);

    // Get challenge information for the post
    const challengeTitle = challenge?.title;
    const challengeType = challenge?.type;

    // Create social post from completion
    createPostFromCompletion(completion, challengeTitle, challengeType);

    console.log(`FQ: Challenge ${challengeId} completed successfully`);
    
    return { success: true, completion, updatedProgress: progress };
  } catch (error) {
    console.error('FQ: Error completing challenge:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Hook for challenge-related actions
 */
export function useChallengeActions() {
  const stonesMap = useStonesMap();
  const challengeToStoneMap = useChallengeToStoneMap();

  const completeChallenge = useCallback(async (params: CompleteChallengeParams) => {
    return completeChallengeAction(params);
  }, []);

  return {
    completeChallenge,
  };
}