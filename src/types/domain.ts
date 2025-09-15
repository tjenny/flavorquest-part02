export type ChallengeType = 'eat' | 'drink' | 'cook';

export interface Challenge {
  id: string;
  stoneId: string;
  type: ChallengeType;
  title: string;
  description: string;
  points: number;
  aiHintEligible: boolean;
  image?: string;
  locationHintAvailable?: boolean;
  isAIGenerated?: boolean;
}

export interface Stone {
  id: string;
  name: string;
  theme: string;
  order: number;
  challengeIds: string[];
  pathId: string; // e.g. 'sg_general'
  emoji?: string;
  color?: string;
  unlocked?: boolean;
  completed?: boolean;
}

export interface Completion {
  id: string;
  userId: string;
  challengeId: string;
  displayTitle: string;
  displayType?: string;
  photoUrl?: string;
  caption?: string;
  rating?: number; // 1-5 stars
  usedAiHint?: boolean;
  createdAt: string;
  placeName?: string;
  placeProvider?: 'google' | 'foursquare' | 'yelp';
  placeId?: string;
  lat?: number;
  lng?: number;
}

export interface UserProgress {
  userId: string;
  pathId: string;
  unlockedStoneIds: string[];
  completedChallengeIds: string[];
  points: number;
  updatedAt: string;
}

export interface AppUser {
  id: string;
  displayName: string;
  isDemo: boolean;
  dietary?: string[];
  progress: UserProgress;
  email?: string;
  photo?: string;
  level?: string;
  isAdmin?: boolean;
}

export interface Country {
  id: string;        // e.g. 'sg'
  name: string;      // 'Singapore'
}

export interface Path {
  id: string;        // e.g. 'sg_general'
  countryId: string; // 'sg'
  name: string;      // 'General'
  order: number;     // 1..N within country
}
