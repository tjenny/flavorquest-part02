import type { UserProgress, Completion } from '@/types/domain';

export interface ProgressPort {
  getProgress(userId: string, pathId: string): Promise<UserProgress>;
  saveProgress(p: UserProgress): Promise<void>;
  addCompletion(c: Completion): Promise<void>;
  listCompletionsByUser(userId: string): Promise<Completion[]>;
}
