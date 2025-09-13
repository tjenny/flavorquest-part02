import type { ProgressPort } from './progress';
import type { UserProgress, Completion } from '@/types/domain';
import { getProgress, saveProgress, addCompletion, getCompletionsByUser } from '@/data/mockRepo';

/**
 * Mock implementation of ProgressPort that wraps mockRepo functions
 * This provides a clean interface for progress operations while maintaining
 * the existing in-memory behavior. Ready for future Supabase implementation.
 */
export const mockProgressPort: ProgressPort = {
  async getProgress(userId: string, pathId: string): Promise<UserProgress> {
    return getProgress(userId, pathId);
  },

  async saveProgress(p: UserProgress): Promise<void> {
    saveProgress(p);
  },

  async addCompletion(c: Completion): Promise<void> {
    addCompletion(c);
  },

  async listCompletionsByUser(userId: string): Promise<Completion[]> {
    return getCompletionsByUser(userId);
  },
};
