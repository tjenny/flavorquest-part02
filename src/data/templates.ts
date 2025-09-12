import type { Challenge, Stone } from '@/types/domain';

// Canonical content templates - all challenges and stones defined here
export const stones: Stone[] = [
  {
    id: 'stone001',
    name: 'Hawker Essentials',
    theme: 'traditional Singapore hawker center dishes and drinks',
    order: 1,
    challengeIds: ['stone001-challenge001', 'stone001-challenge002', 'stone001-challenge003'],
    emoji: '🍜',
    color: 'from-orange-400 to-orange-600',
    unlocked: true,
    completed: false,
  },
  {
    id: 'stone002',
    name: 'Sweet Singapore',
    theme: 'traditional and modern Singaporean desserts and sweet treats',
    order: 2,
    challengeIds: ['stone002-challenge001', 'stone002-challenge002', 'stone002-challenge003'],
    emoji: '🧁',
    color: 'from-pink-400 to-pink-600',
    unlocked: false,
    completed: false,
  },
  {
    id: 'stone003',
    name: 'Spice Adventure',
    theme: 'spicy Southeast Asian dishes popular in Singapore',
    order: 3,
    challengeIds: ['stone003-challenge001', 'stone003-challenge002', 'stone003-challenge003'],
    emoji: '🌶️',
    color: 'from-red-500 to-red-700',
    unlocked: false,
    completed: false,
  },
  {
    id: 'stone004',
    name: 'Modern Fusion',
    theme: 'contemporary fusion cuisine and modern interpretations found in Singapore',
    order: 4,
    challengeIds: ['stone004-challenge001', 'stone004-challenge002', 'stone004-challenge003'],
    emoji: '✨',
    color: 'from-purple-500 to-purple-700',
    unlocked: false,
    completed: false,
  },
];

// Fixed challenges (1 per stone) - these are standard challenges that don't change
export const fixedChallenges: Challenge[] = [
  // Stone 1: Hawker Essentials - Fixed challenge
  {
    id: 'stone001-challenge001',
    stoneId: 'stone001',
    type: 'eat',
    title: 'Hainanese Chicken Rice',
    description: 'Try the iconic Hainanese chicken rice at a hawker center',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
  },
  
  // Stone 2: Sweet Singapore - Fixed challenge
  {
    id: 'stone002-challenge001',
    stoneId: 'stone002',
    type: 'cook',
    title: 'Kaya Toast Mastery',
    description: 'Make traditional kaya toast from scratch',
    points: 100,
    aiHintEligible: false,
    locationHintAvailable: false,
  },
  
  // Stone 3: Spice Adventure - Fixed challenge
  {
    id: 'stone003-challenge001',
    stoneId: 'stone003',
    type: 'eat',
    title: 'Chili Crab Master',
    description: 'Eat chili crab with mantou buns at a seafood restaurant',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
  },
  
  // Stone 4: Modern Fusion - Fixed challenge
  {
    id: 'stone004-challenge001',
    stoneId: 'stone004',
    type: 'eat',
    title: 'Salted Egg Croissant',
    description: 'Try the modern salted egg croissant fusion',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
  },
];

// AI-generated challenges (2 per stone) - these will be generated dynamically
export const aiGeneratedChallenges: Challenge[] = [
  // Stone 1: Hawker Essentials - AI Generated
  {
    id: 'stone001-challenge002',
    stoneId: 'stone001',
    type: 'eat',
    title: 'Char Kway Teow',
    description: 'Try char kway teow at a local hawker',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
    isAIGenerated: true,
  },
  {
    id: 'stone001-challenge003',
    stoneId: 'stone001',
    type: 'drink',
    title: 'Teh Tarik',
    description: 'Order traditional teh tarik from a hawker uncle',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
    isAIGenerated: true,
  },
  
  // Stone 2: Sweet Singapore - AI Generated
  {
    id: 'stone002-challenge002',
    stoneId: 'stone002',
    type: 'eat',
    title: 'Ice Kachang',
    description: 'Try ice kachang with red beans and sweet syrup',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
    isAIGenerated: true,
  },
  {
    id: 'stone002-challenge003',
    stoneId: 'stone002',
    type: 'drink',
    title: 'Bubble Tea',
    description: 'Order bubble tea with your favorite toppings',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
    isAIGenerated: true,
  },
  
  // Stone 3: Spice Adventure - AI Generated
  {
    id: 'stone003-challenge002',
    stoneId: 'stone003',
    type: 'eat',
    title: 'Sambal Stingray',
    description: 'Try sambal stingray at a zi char stall',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
    isAIGenerated: true,
  },
  {
    id: 'stone003-challenge003',
    stoneId: 'stone003',
    type: 'drink',
    title: 'Teh Halia',
    description: 'Drink ginger tea at a mamak stall',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
    isAIGenerated: true,
  },
  
  // Stone 4: Modern Fusion - AI Generated
  {
    id: 'stone004-challenge002',
    stoneId: 'stone004',
    type: 'eat',
    title: 'Truffle Char Kway Teow',
    description: 'Try truffle char kway teow at a modern restaurant',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
    isAIGenerated: true,
  },
  {
    id: 'stone004-challenge003',
    stoneId: 'stone004',
    type: 'drink',
    title: 'Craft Cocktail',
    description: 'Sip a craft cocktail at a trendy bar',
    points: 100,
    aiHintEligible: true,
    locationHintAvailable: true,
    isAIGenerated: true,
  },
];

// Combined challenges (for backward compatibility)
export const challenges: Challenge[] = [...fixedChallenges, ...aiGeneratedChallenges];

// Challenge map for easy lookup by ID
export const CHALLENGE_MAP: Record<string, Challenge> = challenges.reduce((map, challenge) => {
  map[challenge.id] = challenge;
  return map;
}, {} as Record<string, Challenge>);

// Stone map for easy lookup by ID
export const STONE_MAP: Record<string, Stone> = stones.reduce((map, stone) => {
  map[stone.id] = stone;
  return map;
}, {} as Record<string, Stone>);

// General path constant
export const SG_GENERAL_PATH = {
  id: 'sg-general',
  name: 'Singapore General Path'
};