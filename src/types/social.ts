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
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  body: string;
  createdAt: string;
}

export interface Follow {
  followerId: string;
  followeeId: string;
  createdAt: string;
}
