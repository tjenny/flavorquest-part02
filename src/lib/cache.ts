/**
 * Centralized cache management for FlavorQuest
 * Handles cache invalidation and version management
 */

// Cache version - increment this to invalidate all cached data
export const CACHE_VERSION = '1.2.0';

// Cache keys for different types of data
export const CACHE_KEYS = {
  AI_CHALLENGES: 'ai_challenge',
  USER_PREFERENCES: 'user_preferences',
  APP_STATE: 'app_state',
} as const;

/**
 * Cache entry interface
 */
export interface CacheEntry<T = any> {
  version: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
}

/**
 * Create a cache entry with version and metadata
 */
export function createCacheEntry<T>(data: T, ttlHours?: number): CacheEntry<T> {
  const now = Date.now();
  return {
    version: CACHE_VERSION,
    data,
    timestamp: now,
    expiresAt: ttlHours ? now + (ttlHours * 60 * 60 * 1000) : undefined,
  };
}

/**
 * Check if a cache entry is valid (version matches and not expired)
 */
export function isCacheEntryValid<T>(entry: CacheEntry<T>): boolean {
  // Check version
  if (entry.version !== CACHE_VERSION) {
    return false;
  }
  
  // Check expiration
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    return false;
  }
  
  return true;
}

/**
 * Load data from localStorage with cache validation
 */
export function loadFromCache<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const parsed: CacheEntry<T> = JSON.parse(stored);
    
    if (isCacheEntryValid(parsed)) {
      return parsed.data;
    } else {
      // Invalid cache - remove it
      localStorage.removeItem(key);
      return null;
    }
  } catch (error) {
    console.error(`Error loading cache for key ${key}:`, error);
    // Clear corrupted cache
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Save data to localStorage with cache metadata
 */
export function saveToCache<T>(key: string, data: T, ttlHours?: number): void {
  try {
    const cacheEntry = createCacheEntry(data, ttlHours);
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error(`Error saving cache for key ${key}:`, error);
  }
}

/**
 * Clear all cache entries for a specific pattern
 */
export function clearCachePattern(pattern: string): void {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(pattern)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error(`Error clearing cache pattern ${pattern}:`, error);
  }
}

/**
 * Clear all FlavorQuest cache entries
 */
export function clearAllFlavorQuestCache(): void {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('ai_challenge_') ||
        key.startsWith('user_preferences_') ||
        key.startsWith('app_state_') ||
        key.includes('flavorquest')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing all FlavorQuest cache:', error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  totalEntries: number;
  flavorQuestEntries: number;
  versionMismatches: number;
  expiredEntries: number;
} {
  let totalEntries = 0;
  let flavorQuestEntries = 0;
  let versionMismatches = 0;
  let expiredEntries = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      totalEntries++;
      
      if (key.startsWith('ai_challenge_') || 
          key.startsWith('user_preferences_') || 
          key.startsWith('app_state_') ||
          key.includes('flavorquest')) {
        flavorQuestEntries++;
        
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const parsed: CacheEntry = JSON.parse(stored);
            
            if (parsed.version !== CACHE_VERSION) {
              versionMismatches++;
            }
            
            if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
              expiredEntries++;
            }
          }
        } catch (error) {
          // Ignore parsing errors for individual entries
        }
      }
    }
  } catch (error) {
    console.error('Error getting cache stats:', error);
  }
  
  return {
    totalEntries,
    flavorQuestEntries,
    versionMismatches,
    expiredEntries,
  };
}
