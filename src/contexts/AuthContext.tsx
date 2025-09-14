import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppUser } from '@/types/domain';
import { BACKEND } from '@/config/env';
import { ports } from '@/supabase/ports';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  // Current user state
  currentUser: AppUser | null;
  isDemoMode: boolean;
  isLoading: boolean;

  // Demo users
  demoUsers: AppUser[];

  // Authentication actions
  enterDemo: (userId: string) => void;
  exitDemo: () => void;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Demo users for mock mode
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
    id: 'admin',
    displayName: 'Admin User',
    isDemo: true,
    dietary: [],
    progress: {
      userId: 'admin',
      pathId: 'sg_general',
      unlockedStoneIds: ['stone001', 'stone002', 'stone003'],
      completedChallengeIds: ['challenge001', 'challenge002'],
      points: 150,
      updatedAt: new Date().toISOString(),
    },
    email: 'admin@example.com',
    photo: '/src/assets/user-admin.jpg',
    level: 'Food Explorer',
    isAdmin: true,
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(BACKEND === 'mock');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const convertSupabaseUserToAppUser = async (user: User): Promise<AppUser> => {
    try {
      const profile = await ports.profile.getMine();
      
      return {
        id: user.id,
        displayName: profile?.displayName || profile?.username || user.email?.split('@')[0] || 'User',
        isDemo: false,
        dietary: profile?.dietaryPrefs || [],
        progress: {
          userId: user.id,
          pathId: 'sg_general',
          unlockedStoneIds: ['stone001'],
          completedChallengeIds: [],
          points: 0,
          updatedAt: new Date().toISOString(),
        },
        email: user.email || null,
        level: 'Food Newbie',
      };
    } catch (error) {
      console.error('Error converting user:', error);
      
      return {
        id: user.id,
        displayName: user.email?.split('@')[0] || 'User',
        isDemo: false,
        dietary: [],
        progress: {
          userId: user.id,
          pathId: 'sg_general',
          unlockedStoneIds: ['stone001'],
          completedChallengeIds: [],
          points: 0,
          updatedAt: new Date().toISOString(),
        },
        email: user.email || null,
        level: 'Food Newbie',
      };
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      if (BACKEND === 'supabase') {
        // Set up Supabase auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (session?.user) {
              const appUser = await convertSupabaseUserToAppUser(session.user);
              setCurrentUser(appUser);
              setIsDemoMode(false);
              
              // Check if user needs onboarding
              try {
                const profile = await ports.profile.getMine();
                if (!profile?.username || !profile?.dietaryPrefs?.length) {
                  navigate('/onboarding');
                  return;
                }
              } catch (error) {
                // Profile doesn't exist, redirect to onboarding
                navigate('/onboarding');
                return;
              }
            } else {
              setCurrentUser(null);
              if (!isDemoMode) {
                navigate('/auth');
              }
            }
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const appUser = await convertSupabaseUserToAppUser(session.user);
          setCurrentUser(appUser);
          setIsDemoMode(false);
        }
        
        setIsLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Mock mode - use demo user
        setCurrentUser(demoUsers[0]);
        setIsDemoMode(true);
        setIsLoading(false);
      }
    };

    initAuth();
  }, [navigate, isDemoMode]);

  const enterDemo = (userId: string) => {
    const demoUser = demoUsers.find(u => u.id === userId) || null;
    if (demoUser) {
      setCurrentUser(demoUser);
      setIsDemoMode(true);
    }
  };

  const exitDemo = () => {
    setCurrentUser(null);
    setIsDemoMode(false);
    navigate('/auth');
  };

  const signOut = async () => {
    if (BACKEND === 'supabase') {
      await ports.auth.signOut();
    }
    setCurrentUser(null);
    setIsDemoMode(false);
    navigate('/auth');
  };

  const refreshUserProfile = async () => {
    if (BACKEND === 'supabase' && currentUser && !isDemoMode) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const appUser = await convertSupabaseUserToAppUser(data.session.user);
          setCurrentUser(appUser);
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  const value: AuthContextType = {
    currentUser,
    isDemoMode,
    isLoading,
    demoUsers,
    enterDemo,
    exitDemo,
    signOut,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};