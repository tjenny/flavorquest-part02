import { useCallback } from 'react';
import type { Completion } from '@/types/domain';
import { createPostFromCompletion } from '@/data/mockRepo';
import { mockProgressPort } from '@/ports/mockProgress';
import { shouldUnlockNextStone, getNextStoneId, applyUnlock } from '@/features/stones/unlock';

import { POINTS } from '@/config/constants';
import { canonicalizeChallengeId } from '@/config/ids';
import { CHALLENGE_MAP, STONE_MAP } from '@/data/templates';
import { getChallenge } from '@/lib/challengeRegistry';

interface CompleteChallengeParams {
  challengeId: string;
  file?: File | null;
  caption?: string | null;
  rating?: number | null;
  placeName?: string | null;
  userId: string;
}

/**
 * Standalone function for completing challenges (can be imported directly)
 */
export async function completeChallengeAction(params: CompleteChallengeParams) {
  let { challengeId, file, caption, rating, placeName, userId } = params;
  
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

    // Get challenge information - first try CHALLENGE_MAP, then registry, then fallback
    let challenge = CHALLENGE_MAP[challengeId] || getChallenge(challengeId);
    
    // If challenge still not found, create fallback challenge info
    if (!challenge) {
      // Extract stone ID from challenge ID (e.g., "stone001-challenge001" -> "stone001")
      const stoneIdMatch = challengeId.match(/^(stone\d{3})-challenge\d{3}$/);
      const stoneId = stoneIdMatch ? stoneIdMatch[1] : 'stone001';
      
      // Try to get stone information for better challenge details
      const stone = STONE_MAP[stoneId];
      const stoneName = stone?.name || `Stone ${stoneId}`;
      
      // Create a minimal challenge object for completion
      challenge = {
        id: challengeId,
        stoneId: stoneId,
        type: 'eat' as const, // Default type
        title: `${stoneName} Challenge`,
        description: `Complete a challenge from ${stoneName}`,
        points: POINTS.BASE_CHALLENGE,
        aiHintEligible: true,
        locationHintAvailable: false,
        isAIGenerated: true,
      };
    }

    // Calculate points
    let points = POINTS.BASE_CHALLENGE;

    // Create completion record
    const completion: Completion = {
      id: `completion-${Date.now()}`,
      userId,
      challengeId,
      displayTitle: challenge.title,
      displayType: challenge.type,
      photoUrl: photoUrl || '',
      caption: caption || '',
      rating: rating || 0,
      placeName: placeName || '',
      createdAt: new Date().toISOString(),
    };

    // Add completion to repository
    await mockProgressPort.addCompletion(completion);

    // Fetch updated progress + completions
    let progress = await mockProgressPort.getProgress(userId, 'sg_general');
    const completions = await mockProgressPort.listCompletionsByUser(userId);
    const completedIds = completions.map(c => c.challengeId);
    
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

  const completeChallenge = useCallback(async (params: CompleteChallengeParams) => {
    return completeChallengeAction(params);
  }, []);

  return {
    completeChallenge,
  };
}