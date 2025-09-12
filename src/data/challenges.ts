import type { Challenge } from '@/types/domain';

// Fixed challenges (1 per stone) - these are standard challenges that don't change
export const fixedChallenges: Challenge[] = [
  // Stone 1: Hawker Essentials - Fixed challenge
  {
    id: 'stone001_challenge001',
    stoneId: 'stone001',
    type: 'eat',
    title: 'Hainanese Chicken Rice',
    description: 'Try the iconic Hainanese chicken rice at a hawker center',
    points: 100,
    aiHintEligible: true,
  },
  
  // Stone 2: Sweet Singapore - Fixed challenge
  {
    id: 'stone002_challenge001',
    stoneId: 'stone002',
    type: 'cook',
    title: 'Kaya Toast Mastery',
    description: 'Make traditional kaya toast from scratch',
    points: 100,
    aiHintEligible: false,
  },
  
  // Stone 3: Spice Adventure - Fixed challenge
  {
    id: 'stone003_challenge001',
    stoneId: 'stone003',
    type: 'eat',
    title: 'Chili Crab Master',
    description: 'Eat chili crab with mantou buns at a seafood restaurant',
    points: 100,
    aiHintEligible: true,
  },
  
  // Stone 4: Modern Fusion - Fixed challenge
  {
    id: 'stone004_challenge001',
    stoneId: 'stone004',
    type: 'eat',
    title: 'Salted Egg Croissant',
    description: 'Try the modern salted egg croissant fusion',
    points: 100,
    aiHintEligible: true,
  },
];

// AI-generated challenges (2 per stone) - these will be generated dynamically
// This is a fallback for when AI generation fails
export const aiGeneratedChallenges: Challenge[] = [
  // Stone 1: Hawker Essentials - AI Generated
  {
    id: 'stone001_challenge002',
    stoneId: 'stone001',
    type: 'eat',
    title: 'Laksa Adventure',
    description: 'Slurp laksa with cockles at a local hawker',
    points: 100,
    aiHintEligible: true,
  },
  {
    id: 'stone001_challenge003',
    stoneId: 'stone001',
    type: 'drink',
    title: 'Traditional Kopi',
    description: 'Order traditional kopi from a hawker uncle',
    points: 100,
    aiHintEligible: true,
  },
  
  // Stone 2: Sweet Singapore - AI Generated
  {
    id: 'stone002_challenge002',
    stoneId: 'stone002',
    type: 'eat',
    title: 'Ice Kachang Delight',
    description: 'Try ice kachang with red beans and sweet syrup',
    points: 100,
    aiHintEligible: true,
  },
  {
    id: 'stone002_challenge003',
    stoneId: 'stone002',
    type: 'drink',
    title: 'Brown Sugar Bubble Tea',
    description: 'Order brown sugar bubble tea with oat milk',
    points: 100,
    aiHintEligible: true,
  },
  
  // Stone 3: Spice Adventure - AI Generated
  {
    id: 'stone003_challenge002',
    stoneId: 'stone003',
    type: 'eat',
    title: 'Sambal Kangkung',
    description: 'Try sambal kangkung at a zi char stall',
    points: 100,
    aiHintEligible: true,
  },
  {
    id: 'stone003_challenge003',
    stoneId: 'stone003',
    type: 'drink',
    title: 'Teh Tarik Art',
    description: 'Drink teh tarik pulled-style at a mamak stall',
    points: 100,
    aiHintEligible: true,
  },
  
  // Stone 4: Modern Fusion - AI Generated
  {
    id: 'stone004_challenge002',
    stoneId: 'stone004',
    type: 'eat',
    title: 'Mala Hotpot Social',
    description: 'Order mala hotpot with friends at a modern restaurant',
    points: 100,
    aiHintEligible: true,
  },
  {
    id: 'stone004_challenge003',
    stoneId: 'stone004',
    type: 'drink',
    title: 'Pandan Cocktail',
    description: 'Sip craft cocktail with pandan at a trendy bar',
    points: 100,
    aiHintEligible: true,
  },
];

// Combined challenges (for backward compatibility)
export const challenges: Challenge[] = [...fixedChallenges, ...aiGeneratedChallenges];