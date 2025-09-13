import type { AppUser, UserProgress, Completion } from '@/types/domain';
import type { Like, Comment, Follow } from '@/types/social';
import type { Post as SocialPost } from '@/types/social';

// In-memory storage
const users: Map<string, AppUser> = new Map();
const progress: Map<string, UserProgress> = new Map(); // Key: `${userId}:${pathId}`
const completions: Map<string, Completion[]> = new Map();
const posts: Map<string, SocialPost[]> = new Map();
const likesByPost: Map<string, Set<string>> = new Map(); // postId -> Set of userIds who liked
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
        pathId: 'sg_general',
        unlockedStoneIds: ['stone001'],
        completedChallengeIds: [],
        points: 0,
        updatedAt: new Date().toISOString(),
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
        pathId: 'sg_general',
        unlockedStoneIds: ['stone001'],
        completedChallengeIds: [],
        points: 0,
        updatedAt: new Date().toISOString(),
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
        pathId: 'sg_general',
        unlockedStoneIds: ['stone001'],
        completedChallengeIds: [],
        points: 0,
        updatedAt: new Date().toISOString(),
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
        pathId: 'sg_general',
        unlockedStoneIds: ['stone001', 'stone002', 'stone003', 'stone004'],
        completedChallengeIds: ['stone001-challenge001', 'stone001-challenge002', 'stone002-challenge001'],
        points: 300,
        updatedAt: new Date().toISOString(),
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

};

// Initialize on module load
initializeDemoData();

// User operations
export const getUserById = (userId: string): AppUser | null => {
  return users.get(userId) ?? null;
};

// Progress operations
export const getProgress = (userId: string, pathId: string): UserProgress => {
  const key = `${userId}:${pathId}`;
  const storedProgress = progress.get(key);
  
  if (storedProgress) {
    return storedProgress;
  }
  
  // Return fresh progress starting at stone001 if no stored progress
  const freshProgress: UserProgress = {
    userId,
    pathId,
    unlockedStoneIds: ['stone001'],
    completedChallengeIds: [],
    points: 0,
    updatedAt: new Date().toISOString(),
  };
  
  // Store the fresh progress
  progress.set(key, freshProgress);
  return freshProgress;
};

export const saveProgress = (progressData: UserProgress): void => {
  const key = `${progressData.userId}:${progressData.pathId}`;
  progress.set(key, progressData);
};

// Completion operations
export const addCompletion = (completion: Completion): void => {
  const userCompletions = completions.get(completion.userId) ?? [];
  userCompletions.push(completion);
  completions.set(completion.userId, userCompletions);
};

export const getCompletionsByUser = (userId: string): Completion[] => {
  return completions.get(userId) ?? [];
};

// Social operations
export const listFeedForUser = async (currentUserId: string): Promise<SocialPost[]> => {
  // Return all posts from all users for the feed
  const allPosts: SocialPost[] = [];
  
  for (const userPosts of posts.values()) {
    allPosts.push(...userPosts);
  }
  
  // Enrich posts with current like data
  const enrichedPosts = await Promise.all(
    allPosts.map(async (post) => {
      const likeData = await getLikes(post.id, currentUserId);
      return {
        ...post,
        likes: likeData.count,
        likedByCurrentUser: likeData.byCurrentUser,
      };
    })
  );
  
  // Sort by timestamp (newest first)
  return enrichedPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
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
    photo: completion.photoUrl || '/placeholder.svg',
    caption: completion.caption ?? 'Just completed a challenge!',
    timestamp: new Date(completion.createdAt),
    likes: 0, // Will be set by listFeedForUser based on actual likes
    likedByCurrentUser: false, // Will be set by listFeedForUser based on current user
    questCompanions: [], // TODO: Could be populated from completion data
    rating: completion.rating ?? Math.floor(Math.random() * 5) + 1, // Use actual rating from completion
    placeName: completion.placeName, // Include place name from completion
  };
  
  const userPosts = posts.get(completion.userId) ?? [];
  userPosts.push(post);
  posts.set(completion.userId, userPosts);
};

// Like operations
export const toggleLike = async (postId: string, userId: string): Promise<void> => {
  const set = likesByPost.get(postId) ?? new Set<string>();
  if (set.has(userId)) {
    set.delete(userId);
  } else {
    set.add(userId);
  }
  likesByPost.set(postId, set);
};

export const getLikes = async (postId: string, currentUserId?: string): Promise<{count: number, byCurrentUser: boolean}> => {
  const set = likesByPost.get(postId) ?? new Set<string>();
  return { 
    count: set.size, 
    byCurrentUser: currentUserId ? set.has(currentUserId) : false 
  };
};