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

// Initialize demo data - all users start fresh at stone001
const initializeDemoData = () => {
  const demoUsers: AppUser[] = [
    {
      id: '1',
      displayName: 'Sarah Chen',
      isDemo: true,
      dietary: ['Vegetarian'],
      progress: {
        userId: '1',
        unlockedStoneIds: ['stone001'],
        completedChallengeIds: [],
        points: 0,
      },
      email: 'sarah@example.com',
      photo: '/src/assets/user-sarah.jpg',
      level: 'Food Newbie',
    },
    {
      id: '2',
      displayName: 'Mike Tan',
      isDemo: true,
      dietary: [],
      progress: {
        userId: '2',
        unlockedStoneIds: ['stone001'],
        completedChallengeIds: [],
        points: 0,
      },
      email: 'mike@example.com',
      photo: '/src/assets/user-mike.jpg',
      level: 'Food Newbie',
    },
    {
      id: '3',
      displayName: 'Emma Lim',
      isDemo: true,
      dietary: ['Gluten-free'],
      progress: {
        userId: '3',
        unlockedStoneIds: ['stone001'],
        completedChallengeIds: [],
        points: 0,
      },
      email: 'emma@example.com',
      photo: '/src/assets/user-emma.jpg',
      level: 'Food Newbie',
    },
    {
      id: 'admin',
      displayName: 'Admin User',
      isDemo: true,
      dietary: [],
      progress: {
        userId: 'admin',
        unlockedStoneIds: ['stone001', 'stone002', 'stone003', 'stone004'],
        completedChallengeIds: ['stone001-challenge001', 'stone001-challenge002', 'stone002-challenge001'],
        points: 300,
      },
      email: 'admin@example.com',
      photo: '/src/assets/user-admin.jpg',
      level: 'FlavorQuest Master',
      isAdmin: true,
    },
  ];

  // Initialize users
  demoUsers.forEach(user => {
    users.set(user.id, user);
  });

  console.log('FQ: Demo data initialized');
};

// Initialize on module load
initializeDemoData();

// User operations
export const getUserById = (userId: string): AppUser | null => {
  return users.get(userId) ?? null;
};

// Progress operations
export const getProgress = (userId: string): UserProgress | null => {
  const storedProgress = progress.get(userId);
  
  if (storedProgress) {
    return storedProgress;
  }
  
  // Return fresh progress starting at stone001 if no stored progress
  const freshProgress = {
    userId,
    unlockedStoneIds: ['stone001'],
    completedChallengeIds: [],
    points: 0,
  };
  return freshProgress;
};

export const saveProgress = (userId: string, progressData: UserProgress): void => {
  progress.set(userId, progressData);
  console.log(`FQ: Progress saved for user ${userId}`, progressData);
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
  
  for (const userPosts of posts.values()) {
    allPosts.push(...userPosts);
  }
  
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
  console.log(`FQ: Toggling like for post ${postId} by user ${userId}`);
  // Implementation would go here
};