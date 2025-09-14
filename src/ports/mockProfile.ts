import type { ProfilePort, Profile } from './profile';

export const mockProfilePort: ProfilePort = {
  async getMine() {
    // Return a mock demo profile
    return {
      id: 'demo',
      email: 'demo@example.com',
      username: 'demo',
      displayName: 'Demo User',
      dietaryPrefs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  async upsertMine(p) {
    // Mock implementation - return updated profile
    return {
      id: 'demo',
      email: p.email ?? 'demo@example.com',
      username: p.username ?? 'demo',
      displayName: p.displayName ?? p.username ?? 'Demo User',
      dietaryPrefs: p.dietaryPrefs ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  async isUsernameAvailable(username: string) {
    // In mock mode, all usernames are available
    return true;
  }
};