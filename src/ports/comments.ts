import type { Comment } from '@/types/social';

export interface CommentsPort {
  addComment(postId: string, userId: string, body: string, parentCommentId?: string | null): Promise<Comment>;
  listComments(postId: string): Promise<Comment[]>;
  getCommentCount(postId: string): Promise<number>;
}
