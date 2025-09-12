import type { ReactNode} from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppUser, Challenge, Completion } from '@/types/domain';
import type { Post } from '@/types/social';
import { useStones } from '@/features/stones/useStones';
import { useChallengeActions } from '@/features/challenges/useChallengeActions';
import { getCompletionsByUser, listFeedForUser } from '@/data/mockRepo';
import { fixedChallenges, aiGeneratedChallenges } from '@/data/challenges';
import { generateChallenges } from '@/lib/ai/generateChallenges';

interface AppContextType {
  currentUser: AppUser;
  challenges: Challenge[];
  feedPosts: Post[];
  completions: Completion[];
  completeChallenge: (challengeId: string, file?: File, caption?: string, usedAiHint?: boolean) => Promise<{ success: boolean; error?: string }>;
  likeFeedPost: (postId: string) => void;
  refreshData: () => void;
  // For Login component compatibility
  users: AppUser[];
  setCurrentUser: (user: AppUser | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const stones = useStones();
  const { completeChallenge: completeChallengeAction } = useChallengeActions();
  
  // Demo users for Login component
  const demoUsers: AppUser[] = [
    {
      id: '1',
      displayName: 'Sarah Chen',
      isDemo: true,
      dietary: ['Vegetarian'],
      progress: {
        userId: '1',
        unlockedStoneIds: ['stone001'],
        completedChallengeIds: ['stone001_challenge002', 'stone002_challenge001'],
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
        unlockedStoneIds: ['stone001', 'stone002'],
        completedChallengeIds: ['stone001_challenge001', 'stone002_challenge003', 'stone003_challenge001'],
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
        unlockedStoneIds: ['stone001'],
        completedChallengeIds: ['stone001_challenge003'],
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
        unlockedStoneIds: ['stone001', 'stone002', 'stone003', 'stone004'],
        completedChallengeIds: [],
        points: 1000,
      },
      email: 'admin@flavorquest.com',
      photo: '/src/assets/user-admin.jpg',
      level: 'FlavorQuest Master',
      isAdmin: true,
    },
  ];
  
  // Generate challenges: 1 fixed + 2 AI-generated per stone
  const generateAllChallenges = (): Challenge[] => {
    const allChallenges: Challenge[] = [...fixedChallenges];
    
    // Generate AI challenges for each stone
    stones.forEach(stone => {
      const aiChallenges = generateChallenges(stone.id, stone.theme, 2);
      allChallenges.push(...aiChallenges);
    });
    
    return allChallenges;
  };
  
  const challenges = generateAllChallenges();

  // Create dummy feed posts from existing user completions
  const createDummyFeedPosts = (): Post[] => {
    const dummyPosts: Post[] = [];
    
    // Create posts for Sarah's completions
    dummyPosts.push({
      id: 'post-sarah-1',
      userId: '1',
      userName: 'Sarah Chen',
      userPhoto: '/src/assets/user-sarah.jpg',
      challengeId: 'stone001_challenge002',
      challengeTitle: 'Laksa Adventure',
      challengeType: 'eat',
      photo: '/src/assets/chili-crab.jpg',
      caption: 'Just tried my first laksa! The coconut curry was amazing 🍜',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      likes: 15,
      likedByCurrentUser: false,
      questCompanions: ['Mike Tan'],
      rating: 4,
    });
    
    dummyPosts.push({
      id: 'post-sarah-2',
      userId: '1',
      userName: 'Sarah Chen',
      userPhoto: '/src/assets/user-sarah.jpg',
      challengeId: 'stone002_challenge001',
      challengeTitle: 'Kaya Toast Mastery',
      challengeType: 'cook',
      photo: '/src/assets/kaya-toast.jpg',
      caption: 'Made kaya toast from scratch! The kaya was so smooth and sweet 🍞',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      likes: 23,
      likedByCurrentUser: true,
      questCompanions: [],
      rating: 5,
    });
    
    // Create posts for Mike's completions
    dummyPosts.push({
      id: 'post-mike-1',
      userId: '2',
      userName: 'Mike Tan',
      userPhoto: '/src/assets/user-mike.jpg',
      challengeId: 'stone001_challenge001',
      challengeTitle: 'Hainanese Chicken Rice',
      challengeType: 'eat',
      photo: '/src/assets/chicken-rice.jpg',
      caption: 'Tian Tian chicken rice never disappoints! The rice is so fragrant 🍚',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      likes: 31,
      likedByCurrentUser: true,
      questCompanions: ['Sarah Chen', 'Lisa Lim'],
      rating: 5,
    });
    
    dummyPosts.push({
      id: 'post-mike-2',
      userId: '2',
      userName: 'Mike Tan',
      userPhoto: '/src/assets/user-mike.jpg',
      challengeId: 'stone002_challenge003',
      challengeTitle: 'Brown Sugar Bubble Tea',
      challengeType: 'drink',
      photo: '/src/assets/bubble-tea.jpg',
      caption: 'This brown sugar bubble tea is the perfect afternoon treat! 🧋',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      likes: 18,
      likedByCurrentUser: false,
      questCompanions: ['Emma Lim'],
      rating: 4,
    });
    
    dummyPosts.push({
      id: 'post-mike-3',
      userId: '2',
      userName: 'Mike Tan',
      userPhoto: '/src/assets/user-mike.jpg',
      challengeId: 'stone003_challenge001',
      challengeTitle: 'Chili Crab Master',
      challengeType: 'eat',
      photo: '/src/assets/chili-crab.jpg',
      caption: 'Messy hands, happy heart! This chili crab was incredible 🦀',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      likes: 42,
      likedByCurrentUser: false,
      questCompanions: ['Sarah Chen'],
      rating: 4,
    });
    
    // Create posts for Emma's completions
    dummyPosts.push({
      id: 'post-emma-1',
      userId: '3',
      userName: 'Emma Lim',
      userPhoto: '/src/assets/user-sarah.jpg',
      challengeId: 'stone001_challenge003',
      challengeTitle: 'Traditional Kopi',
      challengeType: 'drink',
      photo: '/src/assets/bubble-tea.jpg',
      caption: 'Had my first traditional kopi today! The uncle was so friendly ☕',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      likes: 12,
      likedByCurrentUser: false,
      questCompanions: [],
      rating: 3,
    });
    
    return dummyPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const [feedPosts, setFeedPosts] = useState<Post[]>(createDummyFeedPosts());
  const [completions, setCompletions] = useState<Completion[]>([]);

  const refreshData = () => {
    if (currentUser) {
      const userCompletions = getCompletionsByUser(currentUser.id);
      const newFeedPosts = listFeedForUser(currentUser.id);
      
      // Merge dummy posts with new posts from completions
      const allPosts = [...createDummyFeedPosts(), ...newFeedPosts];
      // Remove duplicates and sort by timestamp
      const uniquePosts = allPosts.filter((post, index, self) => 
        index === self.findIndex(p => p.id === post.id)
      ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setCompletions(userCompletions);
      setFeedPosts(uniquePosts);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser?.id]);

  const completeChallenge = async (
    challengeId: string, 
    file?: File, 
    caption?: string, 
    usedAiHint?: boolean
  ) => {
    const result = await completeChallengeAction({ 
        challengeId,
      file, 
        caption,
      usedAiHint, 
      userId: activeUser.id,
      challenges
    });
    if (result.success) {
      refreshData();
    }
    return result;
  };

  const likeFeedPost = (postId: string) => {
    console.log(`FQ: Liking post ${postId}`);
    // Implementation would go here
  };

  const handleSetCurrentUser = (user: AppUser | null) => {
    setCurrentUser(user);
  };

  // Use currentUser or fallback to first demo user
  const activeUser = currentUser ?? demoUsers[0];

  return (
    <AppContext.Provider value={{
      currentUser: activeUser,
      challenges,
      feedPosts,
      completions,
      completeChallenge,
      likeFeedPost,
      refreshData,
      users: demoUsers,
      setCurrentUser: handleSetCurrentUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};