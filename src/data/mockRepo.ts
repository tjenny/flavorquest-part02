import type { AppUser, UserProgress, Completion, Like, Comment, Follow } from '@/types/domain';
import type { Post as SocialPost } from '@/types/social';

// In-memory storage
const users: Map<string, AppUser> = new Map();
const progress: Map<string, UserProgress> = new Map();
const completions: Map<string, Completion[]> = new Map();
const posts: Map<string, SocialPost[]> = new Map();
const _likes: Map<string, Like[]> = new Map();
const _comments: Map<string, Comment[]> = new Map();
const follows: Map<string, Follow[]> = new Map();

// Initialize demo data
const initializeDemoData = () => {
  const demoUsers: AppUser[] = [
    {
      id: '1',
      displayName: 'Sarah Chen',
      isDemo: true,
      dietary: ['Vegetarian'],
      progress: {
        userId: '1',
        unlockedStoneIds: ['stone1'],
        completedChallengeIds: ['stone1-challenge2', 'stone2-challenge1'],
        points: 200,
      },
      email: 'sarah@example.com',
      photo: '/src/assets/user-sarah.jpg',
      level: 'Flavor Explorer',
    },
    {
      id: '2',
      displayName: 'Mike Tan',
      isDemo: true,
      dietary: [],
      progress: {
        userId: '2',
        unlockedStoneIds: ['stone1', 'stone2'],
        completedChallengeIds: ['stone1-challenge1', 'stone2-challenge3', 'stone3-challenge1'],
        points: 300,
      },
      email: 'mike@example.com',
      photo: '/src/assets/user-mike.jpg',
      level: 'Culinary Adventurer',
    },
    {
      id: '3',
      displayName: 'Emma Lim',
      isDemo: true,
      dietary: ['Gluten-free'],
      progress: {
        userId: '3',
        unlockedStoneIds: ['stone1'],
        completedChallengeIds: ['stone1-challenge3'],
        points: 100,
      },
      email: 'emma@example.com',
      photo: '/src/assets/user-sarah.jpg',
      level: 'Flavor Explorer',
    },
    {
      id: 'admin',
      displayName: 'Admin User',
      isDemo: true,
      dietary: [],
      progress: {
        userId: 'admin',
        unlockedStoneIds: ['stone1', 'stone2', 'stone3', 'stone4'],
        completedChallengeIds: [],
        points: 1000,
      },
      email: 'admin@flavorquest.com',
      photo: '/src/assets/user-admin.jpg',
      level: 'FlavorQuest Master',
      isAdmin: true,
    },
  ];

  demoUsers.forEach(user => {
    users.set(user.id, user);
    progress.set(user.id, user.progress);
    completions.set(user.id, []);
  });
};

// Initialize on module load
initializeDemoData();

// User operations
export const getUser = (userId: string): AppUser | undefined => {
  return users.get(userId);
};

export const getCurrentUser = (): AppUser => {
  // For demo purposes, return the first user
  const user = users.get('1');
  if (!user) {
    throw new Error('FQ: No demo user found');
  }
  return user;
};

// Progress operations
export const getProgress = (userId: string): UserProgress | undefined => {
  return progress.get(userId);
};

export const saveProgress = (userId: string, userProgress: UserProgress): void => {
  progress.set(userId, userProgress);
  const user = users.get(userId);
  if (user) {
    users.set(userId, { ...user, progress: userProgress });
  }
  console.log(`FQ: Progress saved for user ${userId}`, userProgress);
};

// Completion operations
export const addCompletion = (completion: Completion): void => {
  const userCompletions = completions.get(completion.userId) ?? [];
  userCompletions.push(completion);
  completions.set(completion.userId, userCompletions);
  console.log(`FQ: Completion added for user ${completion.userId}`, completion);
};

export const getCompletionsByUser = (userId: string): Completion[] => {
  return completions.get(userId) ?? [];
};

// Social operations (stubs for now)
export const listFeedForUser = (userId: string): SocialPost[] => {
  // Return all posts from all users for the feed
  const allPosts: SocialPost[] = [];
  posts.forEach(userPosts => {
    allPosts.push(...userPosts);
  });
  // Sort by timestamp (newest first)
  return allPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const createPostFromCompletion = (completion: Completion, challengeTitle?: string, challengeType?: string): void => {
  // Get user information
  const user = users.get(completion.userId);
  if (!user) {
    console.error(`FQ: User not found for completion ${completion.id}`);
    return;
  }

  const post: SocialPost = {
    id: `post-${completion.id}`,
    userId: completion.userId,
    userName: user.displayName,
    userPhoto: user.photo,
    challengeId: completion.challengeId,
    challengeTitle: challengeTitle ?? `Challenge ${completion.challengeId}`,
    challengeType: challengeType ?? 'eat',
    photo: completion.photoUrl ?? '/src/assets/placeholder.svg',
    caption: completion.caption ?? 'Just completed a challenge!',
    timestamp: new Date(completion.createdAt),
    likes: Math.floor(Math.random() * 50) + 1, // Random likes for demo
    likedByCurrentUser: false,
    questCompanions: [], // TODO: Could be populated from completion data
    rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
  };
  
  const userPosts = posts.get(completion.userId) ?? [];
  userPosts.push(post);
  posts.set(completion.userId, userPosts);
  console.log(`FQ: Post created from completion ${completion.id}`);
};

export const toggleLike = (postId: string, userId: string): void => {
  console.log(`FQ: Like toggled for post ${postId} by user ${userId}`);
  // Implementation would go here
};

export const addComment = (postId: string, userId: string, body: string): void => {
  console.log(`FQ: Comment added to post ${postId} by user ${userId}: ${body}`);
  // Implementation would go here
};

export const listFollows = (userId: string): Follow[] => {
  return follows.get(userId) ?? [];
};

export const follow = (userId: string, targetId: string): void => {
  console.log(`FQ: User ${userId} followed ${targetId}`);
  // Implementation would go here
};

export const unfollow = (userId: string, targetId: string): void => {
  console.log(`FQ: User ${userId} unfollowed ${targetId}`);
  // Implementation would go here
};
