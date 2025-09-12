import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Challenge, FeedPost, demoUsers, weeklychallenges, demoPosts, steppingStones } from '@/data/demoData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  challenges: Challenge[];
  feedPosts: FeedPost[];
  setCurrentUser: (user: User | null) => void;
  completeChallenge: (challengeId: string, photo: string, caption: string, rating: number) => void;
  likeFeedPost: (postId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [challenges, setChallenges] = useState<Challenge[]>(weeklychallenges);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(demoPosts);

  // Function to sync AI challenges from localStorage into the challenges array
  const syncAIChallenges = (userId: string) => {
    const updatedChallenges = [...weeklychallenges];
    let hasChanges = false;

    // Check each stone for AI challenges in localStorage
    steppingStones.forEach(stone => {
      const storageKey = `ai_challenge_${stone.id}_${userId}`;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const cached = JSON.parse(stored);
          const aiChallenges = cached.challenges || [];
          
          if (aiChallenges && Array.isArray(aiChallenges) && aiChallenges.length > 0) {
            // Handle first AI challenge (challenge1)
            if (aiChallenges[0]) {
              const aiChallenge1Id = `${stone.id}-challenge1`;
              const existingIndex1 = updatedChallenges.findIndex(c => c.id === aiChallenge1Id);
              
              const aiChallengeData1: Challenge = {
                id: aiChallenge1Id,
                stoneId: stone.id,
                title: aiChallenges[0].description || aiChallenges[0].title || 'Personalized Challenge 1',
                description: aiChallenges[0].description || 'AI-generated personalized challenge',
                points: aiChallenges[0].points || 100,
                image: '/src/assets/hero-singapore-food.jpg', // Default image
                locationHintAvailable: false,
                type: aiChallenges[0].type || 'eat',
                isAIGenerated: true
              };

              if (existingIndex1 >= 0) {
                updatedChallenges[existingIndex1] = aiChallengeData1;
              } else {
                updatedChallenges.push(aiChallengeData1);
              }
              hasChanges = true;
            }

            // Handle second AI challenge (challenge2)
            if (aiChallenges[1]) {
              const aiChallenge2Id = `${stone.id}-challenge2`;
              const existingIndex2 = updatedChallenges.findIndex(c => c.id === aiChallenge2Id);
              
              const aiChallengeData2: Challenge = {
                id: aiChallenge2Id,
                stoneId: stone.id,
                title: aiChallenges[1].description || aiChallenges[1].title || 'Personalized Challenge 2',
                description: aiChallenges[1].description || 'AI-generated personalized challenge',
                points: aiChallenges[1].points || 100,
                image: '/src/assets/hero-singapore-food.jpg', // Default image
                locationHintAvailable: false,
                type: aiChallenges[1].type || 'eat',
                isAIGenerated: true
              };

              if (existingIndex2 >= 0) {
                updatedChallenges[existingIndex2] = aiChallengeData2;
              } else {
                updatedChallenges.push(aiChallengeData2);
              }
              hasChanges = true;
            }
          }
        }
      } catch (error) {
        console.error(`Error loading AI challenges for stone ${stone.id}:`, error);
      }
    });

    if (hasChanges) {
      setChallenges(updatedChallenges);
    }
  };

  // Sync AI challenges when current user changes
  useEffect(() => {
    if (currentUser) {
      syncAIChallenges(currentUser.id);
    }
  }, [currentUser]);

  const completeChallenge = (challengeId: string, photo: string, caption: string, rating: number) => {
    if (!currentUser) return;

    // Update user's completed challenges and points
    const updatedUser = {
      ...currentUser,
      completedChallenges: [...currentUser.completedChallenges, challengeId],
      totalPoints: currentUser.totalPoints + 100
    };
    
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id ? updatedUser : user
    ));

    // Update challenge as completed
    setChallenges(prev => {
      const updated = prev.map(challenge =>
        challenge.id === challengeId 
          ? { ...challenge, completed: true, userPhoto: photo, userCaption: caption }
          : challenge
      );
      
      // Find challenge title from the updated challenges array
      const challenge = updated.find(c => c.id === challengeId);
      const challengeTitle = challenge?.title || 'Challenge';

      // Create feed post
      const newPost: FeedPost = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userPhoto: currentUser.photo,
        challengeId,
        challengeTitle,
        challengeType: challenge?.type, // Add challenge type
        photo,
        caption,
        timestamp: new Date(),
        likes: 0,
        likedByCurrentUser: false,
        questCompanions: [],
        rating
      };
      
      setFeedPosts(prev => [newPost, ...prev]);
      
      return updated;
    });
  };

  const likeFeedPost = (postId: string) => {
    setFeedPosts(prev => prev.map(post =>
      post.id === postId
        ? {
            ...post,
            likes: post.likedByCurrentUser ? post.likes - 1 : post.likes + 1,
            likedByCurrentUser: !post.likedByCurrentUser
          }
        : post
    ));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    ));
    
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      challenges,
      feedPosts,
      setCurrentUser,
      completeChallenge,
      likeFeedPost,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};