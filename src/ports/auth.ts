export interface AuthPort {
  getSession(): Promise<{ userId: string | null; email?: string | null }>;
  signUpWithMagicLink(email: string): Promise<void>;
  signInWithMagicLink(email: string): Promise<void>;
  signOut(): Promise<void>;
}