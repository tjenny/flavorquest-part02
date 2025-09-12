// Game constants
export const POINTS = {
  BASE_CHALLENGE: 100,
  AI_HINT_PENALTY: 10, // 10% penalty for using AI hint
} as const;

export const PENALTIES = {
  AI_HINT_PERCENTAGE: 0.1, // 10% penalty
} as const;

export const FIRST_STONE_ID = 'stone001';

export const UNLOCK_RULE = {
  MIN_COMPLETED_FOR_UNLOCK: 1, // Complete 1 of 3 challenges to unlock next stone
} as const;
