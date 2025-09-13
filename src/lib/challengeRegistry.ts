import type { Challenge } from '@/types/domain';

/**
 * Global challenge registry for dynamically generated challenges
 * This allows challenges generated in components to be accessible globally
 */
class ChallengeRegistry {
  private challenges: Map<string, Challenge> = new Map();

  /**
   * Register a challenge in the global registry
   */
  register(challenge: Challenge): void {
    this.challenges.set(challenge.id, challenge);
  }

  /**
   * Register multiple challenges at once
   */
  registerBatch(challenges: Challenge[]): void {
    challenges.forEach(challenge => this.register(challenge));
  }

  /**
   * Get a challenge by ID
   */
  get(challengeId: string): Challenge | undefined {
    return this.challenges.get(challengeId);
  }

  /**
   * Check if a challenge exists in the registry
   */
  has(challengeId: string): boolean {
    return this.challenges.has(challengeId);
  }

  /**
   * Get all registered challenges
   */
  getAll(): Challenge[] {
    return Array.from(this.challenges.values());
  }

  /**
   * Clear all challenges (useful for testing)
   */
  clear(): void {
    this.challenges.clear();
  }

  /**
   * Get the number of registered challenges
   */
  size(): number {
    return this.challenges.size;
  }

  /**
   * Get all challenge IDs
   */
  getIds(): string[] {
    return Array.from(this.challenges.keys());
  }
}

// Export a singleton instance
export const challengeRegistry = new ChallengeRegistry();

/**
 * Helper function to get a challenge, falling back to the registry if not found in CHALLENGE_MAP
 */
export function getChallenge(challengeId: string): Challenge | null {
  // First try the registry
  const registryChallenge = challengeRegistry.get(challengeId);
  if (registryChallenge) {
    return registryChallenge;
  }

  // If not found, return null (caller should handle fallback)
  return null;
}
