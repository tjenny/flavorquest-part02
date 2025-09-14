import { supabase } from '@/lib/supabaseClient';
import type { AuthPort } from './auth';

export const supabaseAuthPort: AuthPort = {
  async getSession() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    return { userId: user?.id ?? null, email: user?.email ?? null };
  },
  
  async signUp(email, password) {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: window.location.origin } 
    });
    if (error) throw error;
  },
  
  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    if (error) throw error;
  },
  
  async signOut() { 
    await supabase.auth.signOut(); 
  }
};