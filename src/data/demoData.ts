export interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
  dietaryRestrictions: string[];
  totalPoints: number;
  level: string;
  completedChallenges: string[];
  isAdmin?: boolean;
}

export interface Challenge {
  id: string;
  stoneId: string;
  title: string;
  description: string;
  points: number;
  image: string;
  locationHintAvailable: boolean;
  type?: 'eat' | 'drink' | 'cook';
  isAIGenerated?: boolean;
  completed?: boolean;
  userPhoto?: string;
  userCaption?: string;
  completedAt?: Date;
}

export interface Stone {
  id: string;
  title: string;
  emoji: string;
  color: string;
  theme: string;
  challenges: Challenge[];
  unlocked: boolean;
  completed: boolean;
}

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  challengeId: string;
  challengeTitle: string;
  challengeType?: string; // Added challenge type
  photo: string;
  caption: string;
  timestamp: Date;
  likes: number;
  likedByCurrentUser: boolean;
  questCompanions: string[];
  rating: number; // 1-5 stars
}

export const demoUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    photo: '/src/assets/user-sarah.jpg',
    dietaryRestrictions: ['Vegetarian'],
    totalPoints: 200,
    level: 'Flavor Explorer',
    completedChallenges: ['stone1-challenge2', 'stone2-challenge1'],
  },
  {
    id: '2',
    name: 'Mike Tan',
    email: 'mike@example.com',
    photo: '/src/assets/user-mike.jpg',
    dietaryRestrictions: [],
    totalPoints: 300,
    level: 'Culinary Adventurer',
    completedChallenges: ['stone1-challenge1', 'stone2-challenge3', 'stone3-challenge1'],
  },
  {
    id: '3',
    name: 'Emma Lim',
    email: 'emma@example.com',
    photo: '/src/assets/user-sarah.jpg',
    dietaryRestrictions: ['Gluten-free'],
    totalPoints: 100,
    level: 'Flavor Explorer',
    completedChallenges: ['stone1-challenge3'],
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@flavorquest.com',
    photo: '/src/assets/user-admin.jpg',
    dietaryRestrictions: [],
    totalPoints: 1000,
    level: 'FlavorQuest Master',
    completedChallenges: [],
    isAdmin: true,
  }
];

export const steppingStones: Stone[] = [
  {
    id: 'stone1',
    title: 'Hawker Essentials',
    emoji: '🍜',
    color: 'from-orange-400 to-orange-600',
    theme: 'traditional Singapore hawker center dishes and drinks',
    unlocked: true,
    completed: false,
    challenges: [
      {
        id: 'stone1-challenge1',
        stoneId: 'stone1',
        title: 'Hainanese Chicken Rice',
        description: 'Try Hainanese chicken rice at a hawker center',
        points: 100,
        image: '/src/assets/chicken-rice.jpg',
        locationHintAvailable: true,
        type: 'eat',
      },
      {
        id: 'stone1-challenge2',
        stoneId: 'stone1',
        title: 'Laksa Adventure',
        description: 'Slurp laksa with cockles',
        points: 100,
        image: '/src/assets/chili-crab.jpg',
        locationHintAvailable: true,
        type: 'eat',
      },
      {
        id: 'stone1-challenge3',
        stoneId: 'stone1',
        title: 'Traditional Kopi',
        description: 'Order traditional kopi from uncle',
        points: 100,
        image: '/src/assets/bubble-tea.jpg',
        locationHintAvailable: true,
        type: 'drink',
      }
    ]
  },
  {
    id: 'stone2',
    title: 'Sweet Singapore',
    emoji: '🧁',
    color: 'from-pink-400 to-pink-600',
    theme: 'traditional and modern Singaporean desserts and sweet treats',
    unlocked: false,
    completed: false,
    challenges: [
      {
        id: 'stone2-challenge1',
        stoneId: 'stone2',
        title: 'Kaya Toast Mastery',
        description: 'Make kaya toast from scratch',
        points: 100,
        image: '/src/assets/kaya-toast.jpg',
        locationHintAvailable: false,
      },
      {
        id: 'stone2-challenge2',
        stoneId: 'stone2',
        title: 'Ice Kachang Delight',
        description: 'Try ice kachang with red beans',
        points: 100,
        image: '/src/assets/durian-ice-cream.jpg',
        locationHintAvailable: true,
      },
      {
        id: 'stone2-challenge3',
        stoneId: 'stone2',
        title: 'Brown Sugar Bubble Tea',
        description: 'Order brown sugar bubble tea with oat milk',
        points: 100,
        image: '/src/assets/bubble-tea.jpg',
        locationHintAvailable: true,
      }
    ]
  },
  {
    id: 'stone3',
    title: 'Spice Adventure',
    emoji: '🌶️',
    color: 'from-red-500 to-red-700',
    theme: 'spicy Southeast Asian dishes popular in Singapore',
    unlocked: false,
    completed: false,
    challenges: [
      {
        id: 'stone3-challenge1',
        stoneId: 'stone3',
        title: 'Chili Crab Master',
        description: 'Eat chili crab with mantou buns',
        points: 100,
        image: '/src/assets/chili-crab.jpg',
        locationHintAvailable: true,
      },
      {
        id: 'stone3-challenge2',
        stoneId: 'stone3',
        title: 'Sambal Kangkung',
        description: 'Try sambal kangkung at zi char',
        points: 100,
        image: '/src/assets/chicken-rice.jpg',
        locationHintAvailable: true,
      },
      {
        id: 'stone3-challenge3',
        stoneId: 'stone3',
        title: 'Teh Tarik Art',
        description: 'Drink teh tarik pulled-style',
        points: 100,
        image: '/src/assets/bubble-tea.jpg',
        locationHintAvailable: true,
      }
    ]
  },
  {
    id: 'stone4',
    title: 'Modern Fusion',
    emoji: '✨',
    color: 'from-purple-500 to-purple-700',
    theme: 'contemporary fusion cuisine and modern interpretations found in Singapore',
    unlocked: false,
    completed: false,
    challenges: [
      {
        id: 'stone4-challenge1',
        stoneId: 'stone4',
        title: 'Salted Egg Croissant',
        description: 'Try salted egg croissant',
        points: 100,
        image: '/src/assets/kaya-toast.jpg',
        locationHintAvailable: true,
      },
      {
        id: 'stone4-challenge2',
        stoneId: 'stone4',
        title: 'Mala Hotpot Social',
        description: 'Order mala hotpot with friends',
        points: 100,
        image: '/src/assets/chili-crab.jpg',
        locationHintAvailable: true,
      },
      {
        id: 'stone4-challenge3',
        stoneId: 'stone4',
        title: 'Pandan Cocktail',
        description: 'Sip craft cocktail with pandan',
        points: 100,
        image: '/src/assets/durian-ice-cream.jpg',
        locationHintAvailable: true,
      }
    ]
  }
];

// Legacy challenges for backward compatibility
export const weeklychallenges: Challenge[] = steppingStones.flatMap(stone => stone.challenges);

export const demoPosts: FeedPost[] = [
  {
    id: '2',
    userId: '2',
    userName: 'Mike Tan',
    userPhoto: '/src/assets/user-mike.jpg',
    challengeId: 'stone1-challenge1',
    challengeTitle: 'Hainanese Chicken Rice',
    photo: '/src/assets/chicken-rice.jpg',
    caption: 'Tian Tian chicken rice never disappoints! The rice is so fragrant 🍚',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 31,
    likedByCurrentUser: true,
    questCompanions: ['Sarah Chen', 'Lisa Lim'],
    rating: 5,
  },
  {
    id: '3',
    userId: '1',
    userName: 'Sarah Chen',
    userPhoto: '/src/assets/user-sarah.jpg',
    challengeId: 'stone3-challenge1',
    challengeTitle: 'Chili Crab Master',
    photo: '/src/assets/chili-crab.jpg',
    caption: 'Messy hands, happy heart! This chili crab was incredible 🦀',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    likes: 42,
    likedByCurrentUser: false,
    questCompanions: ['Mike Tan'],
    rating: 4,
  },
  {
    id: '4',
    userId: '2',
    userName: 'Mike Tan',
    userPhoto: '/src/assets/user-mike.jpg',
    challengeId: 'stone2-challenge2',
    challengeTitle: 'Ice Kachang Delight',
    photo: '/src/assets/durian-ice-cream.jpg',
    caption: 'Conquered my fear of durian! Actually quite creamy and sweet 🍦',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    likes: 18,
    likedByCurrentUser: true,
    questCompanions: ['Jenny Ng'],
    rating: 3,
  }
];

export const getLevelInfo = (points: number) => {
  if (points < 100) return { level: 'Food Newbie', progress: points, nextLevel: 100 };
  if (points < 300) return { level: 'Flavor Explorer', progress: points - 100, nextLevel: 200 };
  if (points < 500) return { level: 'Culinary Adventurer', progress: points - 300, nextLevel: 200 };
  return { level: 'FlavorQuest Master', progress: 0, nextLevel: 0 };
};