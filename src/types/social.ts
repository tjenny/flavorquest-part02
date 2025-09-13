export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  challengeId: string;
  challengeTitle: string;
  challengeType?: string;
  photo: string;
  caption: string;
  timestamp: Date;
  likes: number;
  likedByCurrentUser: boolean;
  questCompanions: string[];
  rating: number; // 1-5 stars
  placeName?: string;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Comment {
  id: string;            // e.g. 'cmt_<ts>_<rand>'
  postId: string;        // FK -> posts.id (mock: your post id)
  userId: string;        // who wrote it
  body: string;          // plain text
  createdAt: string;     // ISO timestamp
  // Optional for future threading:
  parentCommentId?: string | null;
}

export interface PostWithCounts {
  id: string;
  // ...existing post fields...
  likeCount?: number;
  likedByCurrentUser?: boolean;
  commentCount?: number;    // <-- new
}

export interface Follow {
  followerId: string;
  followeeId: string;
  createdAt: string;
}
