import type { UserProgress, Completion } from '@/types/domain';
import type { Post } from '@/types/social';

/**
 * Port interfaces for data access - designed to be easily swappable
 * between mock implementation and Supabase implementation
 */

export interface ProgressPort {
  get(userId: string): Promise<UserProgress | null>;
  save(userId: string, progress: UserProgress): Promise<void>;
}

export interface CompletionPort {
  add(completion: Completion): Promise<void>;
  listByUser(userId: string): Promise<Completion[]>;
}

export interface SocialPort {
  createPostFromCompletion(completion: Completion): Promise<void>;
  listFeedForUser(userId: string): Promise<Post[]>;
  toggleLike(postId: string, userId: string): Promise<void>;
  addComment(postId: string, userId: string, body: string): Promise<void>;
}

/**
 * Mock implementation of ports (current implementation)
 */
import { getProgress, saveProgress, addCompletion, getCompletionsByUser, createPostFromCompletion, listFeedForUser, toggleLike, addComment } from '@/data/mockRepo';

export const mockProgressPort: ProgressPort = {
  async get(userId: string): Promise<UserProgress | null> {
    return getProgress(userId) ?? null;
  },
  
  async save(userId: string, progress: UserProgress): Promise<void> {
    saveProgress(userId, progress);
  },
};

export const mockCompletionPort: CompletionPort = {
  async add(completion: Completion): Promise<void> {
    addCompletion(completion);
  },
  
  async listByUser(userId: string): Promise<Completion[]> {
    return getCompletionsByUser(userId);
  },
};

export const mockSocialPort: SocialPort = {
  async createPostFromCompletion(completion: Completion): Promise<void> {
    createPostFromCompletion(completion);
  },
  
  async listFeedForUser(userId: string): Promise<Post[]> {
    return listFeedForUser(userId);
  },
  
  async toggleLike(postId: string, userId: string): Promise<void> {
    toggleLike(postId, userId);
  },
  
  async addComment(postId: string, userId: string, body: string): Promise<void> {
    addComment(postId, userId, body);
  },
};

/**
 * Factory function to get the appropriate port implementation
 * This will be used to conditionally load Supabase ports later
 */
export function getProgressPort(): ProgressPort {
  // For now, always return mock implementation
  // Later: return env.VITE_USE_SUPABASE ? supabaseProgressPort : mockProgressPort;
  return mockProgressPort;
}

export function getCompletionPort(): CompletionPort {
  return mockCompletionPort;
}

export function getSocialPort(): SocialPort {
  return mockSocialPort;
}
