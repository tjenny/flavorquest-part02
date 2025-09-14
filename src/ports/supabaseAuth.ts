import { supabase } from '@/lib/supabaseClient';
import type { AuthPort } from './auth';

export const supabaseAuthPort: AuthPort = {
  async getSession() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    return { userId: user?.id ?? null, email: user?.email ?? null };
  },
  
  async signUpWithMagicLink(email) {
    const { error } = await supabase.auth.signUp({ 
      email, 
      options: { emailRedirectTo: window.location.origin } 
    });
    if (error) throw error;
  },
  
  async signInWithMagicLink(email) {
    const { error } = await supabase.auth.signInWithOtp({ 
      email, 
      options: { emailRedirectTo: window.location.origin } 
    });
    if (error) throw error;
  },
  
  async signOut() { 
    await supabase.auth.signOut(); 
  }
};