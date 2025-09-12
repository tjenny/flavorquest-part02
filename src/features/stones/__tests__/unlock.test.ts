import { describe, it, expect } from 'vitest';
import { shouldUnlockNextStone, getNextStoneId, applyUnlock } from '../unlock';
import type { Stone, UserProgress } from '@/types/domain';

describe('unlock logic', () => {
  const mockStones: Record<string, Stone> = {
    stone1: {
      id: 'stone1',
      name: 'Stone 1',
      theme: 'Test theme 1',
      order: 1,
      challengeIds: ['challenge1', 'challenge2', 'challenge3'],
    },
    stone2: {
      id: 'stone2',
      name: 'Stone 2',
      theme: 'Test theme 2',
      order: 2,
      challengeIds: ['challenge4', 'challenge5', 'challenge6'],
    },
    stone3: {
      id: 'stone3',
      name: 'Stone 3',
      theme: 'Test theme 3',
      order: 3,
      challengeIds: ['challenge7', 'challenge8', 'challenge9'],
    },
  };

  describe('shouldUnlockNextStone', () => {
    it('should return false when no challenges are completed', () => {
      const result = shouldUnlockNextStone('stone1', [], mockStones);
      expect(result).toBe(false);
    });

    it('should return true when one challenge is completed (1-of-3 rule)', () => {
      const result = shouldUnlockNextStone('stone1', ['challenge1'], mockStones);
      expect(result).toBe(true);
    });

    it('should return true when multiple challenges are completed', () => {
      const result = shouldUnlockNextStone('stone1', ['challenge1', 'challenge2'], mockStones);
      expect(result).toBe(true);
    });

    it('should return false when stone does not exist', () => {
      const result = shouldUnlockNextStone('nonexistent', ['challenge1'], mockStones);
      expect(result).toBe(false);
    });
  });

  describe('getNextStoneId', () => {
    it('should return next stone ID in sequence', () => {
      const result = getNextStoneId('stone1', mockStones);
      expect(result).toBe('stone2');
    });

    it('should return null for last stone', () => {
      const result = getNextStoneId('stone3', mockStones);
      expect(result).toBe(null);
    });

    it('should return null for nonexistent stone', () => {
      const result = getNextStoneId('nonexistent', mockStones);
      expect(result).toBe(null);
    });
  });

  describe('applyUnlock', () => {
    const baseProgress: UserProgress = {
      userId: 'user1',
      unlockedStoneIds: ['stone1'],
      completedChallengeIds: [],
      points: 0,
    };

    it('should add new stone to unlocked list', () => {
      const result = applyUnlock(baseProgress, 'stone2');
      expect(result.unlockedStoneIds).toEqual(['stone1', 'stone2']);
    });

    it('should not add duplicate stone', () => {
      const result = applyUnlock(baseProgress, 'stone1');
      expect(result.unlockedStoneIds).toEqual(['stone1']);
    });

    it('should return unchanged progress when nextStoneId is null', () => {
      const result = applyUnlock(baseProgress, null);
      expect(result).toBe(baseProgress);
    });

    it('should not mutate original progress object', () => {
      const originalIds = [...baseProgress.unlockedStoneIds];
      applyUnlock(baseProgress, 'stone2');
      expect(baseProgress.unlockedStoneIds).toEqual(originalIds);
    });
  });
});
