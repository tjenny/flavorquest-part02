import type { ReactNode} from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppUser, Challenge, Completion } from '@/types/domain';
import type { Post } from '@/types/social';
import { useStones } from '@/features/stones/useStones';
import { useChallengeActions } from '@/features/challenges/useChallengeActions';
import { getCompletionsByUser, listFeedForUser } from '@/data/mockRepo';
import { stones, challenges } from '@/data/templates';

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
  
  // Use challenges from templates

  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);

  const refreshData = () => {
    if (currentUser) {
      const userCompletions = getCompletionsByUser(currentUser.id);
      const newFeedPosts = listFeedForUser(currentUser.id);
      
      setCompletions(userCompletions);
      setFeedPosts(newFeedPosts);
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