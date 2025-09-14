export interface AuthPort {
  getSession(): Promise<{ userId: string | null; email?: string | null }>;
  signUp(email: string, password: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}