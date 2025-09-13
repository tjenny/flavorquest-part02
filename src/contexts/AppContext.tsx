import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AppUser, Challenge, Completion } from '@/types/domain';
import type { Post } from '@/types/social';
import { listFeedForUser, toggleLike } from '@/data/mockRepo';
import { mockProgressPort } from '@/ports/mockProgress';
import { completeChallengeAction } from '@/features/challenges/useChallengeActions';
import { challenges } from '@/data/templates';

interface AppContextType {
  currentUser: AppUser | null;
  challenges: Challenge[];
  feedPosts: Post[];
  completions: Completion[];
  completeChallenge: (challengeId: string, file?: File, caption?: string, rating?: number) => Promise<{ success: boolean; error?: string }>;
  likeFeedPost: (postId: string) => void;
  refreshData: () => void;
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

  // Demo users for testing
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
  
  // Use challenges from templates

  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);

  const refreshData = async () => {
    if (currentUser) {
      try {
        const userCompletions = await mockProgressPort.listCompletionsByUser(currentUser.id);
        const newFeedPosts = await listFeedForUser(currentUser.id);
        const userProgress = await mockProgressPort.getProgress(currentUser.id, 'sg_general');
        
        setCompletions(userCompletions);
        setFeedPosts(newFeedPosts);
        
        // Update currentUser with fresh progress data
        setCurrentUser(prev => prev ? {
          ...prev,
          progress: userProgress
        } : null);
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser?.id]);

  const completeChallenge = async (
    challengeId: string, 
    file?: File, 
    caption?: string, 
    rating?: number
  ) => {
    const result = await completeChallengeAction({ 
        challengeId,
      file, 
        caption,
      rating, 
      userId: activeUser.id,
      challenges
    });
    if (result.success) {
      await refreshData();
    }
    return result;
  };

  const likeFeedPost = async (postId: string) => {
    if (!currentUser) return;
    
    try {
      // Toggle the like in the repository
      await toggleLike(postId, currentUser.id);
      
      // Optimistically update the feed state
      setFeedPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const newLikedByCurrentUser = !post.likedByCurrentUser;
            return {
              ...post,
              likedByCurrentUser: newLikedByCurrentUser,
              likes: newLikedByCurrentUser ? post.likes + 1 : post.likes - 1,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
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