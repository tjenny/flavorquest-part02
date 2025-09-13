import type { CommentsPort } from './comments';
import { addComment, listComments, getCommentCount } from '@/data/mockRepo';

export const mockCommentsPort: CommentsPort = {
  addComment,
  listComments,
  getCommentCount,
};
