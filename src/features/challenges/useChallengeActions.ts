import { useCallback } from 'react';
import type { Completion, Challenge } from '@/types/domain';
import { createPostFromCompletion } from '@/data/mockRepo';
import { mockProgressPort } from '@/ports/mockProgress';
import { shouldUnlockNextStone, getNextStoneId, applyUnlock } from '@/features/stones/unlock';
import { useStonesMap, useChallengeToStoneMap } from '@/features/stones/useStones';
import { POINTS, PENALTIES } from '@/config/constants';
import { canonicalizeChallengeId } from '@/config/ids';
import { SG_GENERAL_PATH, CHALLENGE_MAP, STONE_MAP } from '@/data/templates';

interface CompleteChallengeParams {
  challengeId: string;
  file?: File;
  caption?: string;
  rating?: number;
  userId: string;
  challenges: Challenge[]; // Add challenges parameter
}

/**
 * Standalone function for completing challenges (can be imported directly)
 */
export async function completeChallengeAction(params: CompleteChallengeParams) {
  let { challengeId, file, caption, rating, userId, challenges } = params;
  
  // Canonicalize the challenge ID to ensure consistency
  challengeId = canonicalizeChallengeId(challengeId);
  
  try {
    
    // Upload file (stub implementation)
    let photoUrl: string | undefined;
    if (file) {
      // For demo purposes, we'll use a data URL instead of fake upload
      // In a real app, this would upload to a service like AWS S3, Cloudinary, etc.
      const reader = new FileReader();
      photoUrl = await new Promise<string>((resolve) => {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result);
        };
        reader.readAsDataURL(file);
      });
    }

    // Calculate points
    let points = POINTS.BASE_CHALLENGE;

    // Create completion record
    const completion: Completion = {
      id: `completion-${Date.now()}`,
      userId,
      challengeId,
      photoUrl,
      caption,
      rating,
      createdAt: new Date().toISOString(),
    };

    // Add completion to repository
    await mockProgressPort.addCompletion(completion);

    // Fetch updated progress + completions
    let progress = await mockProgressPort.getProgress(userId, 'sg_general');
    const completions = await mockProgressPort.listCompletionsByUser(userId);
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
    }

    // Save updated progress
    await mockProgressPort.saveProgress(progress);

    // Get challenge information for the post
    const challengeTitle = challenge?.title;
    const challengeType = challenge?.type;

    // Create social post from completion
    createPostFromCompletion(completion, challengeTitle, challengeType);

    
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