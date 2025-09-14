import type { AuthPort } from './auth';

export const mockAuthPort: AuthPort = {
  async getSession() {
    // In mock mode, there's no real session
    return { userId: null, email: null };
  },
  
  async signUp(email: string, password: string) {
    // Mock implementation - no actual signup
    console.log('Mock signup for:', email, 'with password');
  },
  
  async signIn(email: string, password: string) {
    // Mock implementation - no actual signin
    console.log('Mock signin for:', email, 'with password');
  },
  
  async signOut() {
    // Mock implementation - no actual signout
    console.log('Mock signout');
  }
};