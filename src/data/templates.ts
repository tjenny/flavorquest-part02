import type { Country, Path, Stone, Challenge } from '@/types/domain';

export const COUNTRIES: Country[] = [
  { id: 'sg', name: 'Singapore' },
];

export const PATHS: Path[] = [
  { id: 'sg_general', countryId: 'sg', name: 'General', order: 1 },
];

// Canonical content templates - all challenges and stones defined here
export const stones: Stone[] = [
  {
    id: 'stone001',
    pathId: 'sg_general',
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
    pathId: 'sg_general',
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
    pathId: 'sg_general',
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
    pathId: 'sg_general',
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

// All challenges are now AI-generated dynamically
export const challenges: Challenge[] = [];

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

export const COUNTRY_MAP = Object.fromEntries(COUNTRIES.map(c => [c.id, c]));
export const PATH_MAP = Object.fromEntries(PATHS.map(p => [p.id, p]));

// For now, the app is single-country/single-path:
export const CURRENT_COUNTRY_ID = 'sg';
export const CURRENT_PATH_ID = 'sg_general';

// Quick lookup for stones by ID
export const STONE_BY_ID = Object.fromEntries(stones.map(s => [s.id, s]));

// Helper to parse stone id from a challenge id
export function stoneIdFromChallengeId(chId: string): string | null {
  const m = chId.match(/^(stone\d{3})-challenge\d{3}$/);
  return m ? m[1] : null;
}

// Template helpers for challenge counts
export function allChallengeIdsForPath(pathId: string): string[] {
  return stones.filter(s => s.pathId === pathId)
               .flatMap(s => s.challengeIds);
}

export function allChallengeIdsForCountry(countryId: string): string[] {
  const pathIds = PATHS.filter(p => p.countryId === countryId).map(p => p.id);
  return pathIds.flatMap(pid => allChallengeIdsForPath(pid));
}