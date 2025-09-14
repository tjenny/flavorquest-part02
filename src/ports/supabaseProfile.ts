import { supabase } from '@/lib/supabaseClient';
import type { ProfilePort, Profile } from './profile';

function mapRow(r: any): Profile {
  return {
    id: r.id,
    email: r.email ?? null,
    username: r.username ?? null,
    displayName: r.display_name ?? null,
    dietaryPrefs: r.dietary_prefs ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export const supabaseProfilePort: ProfilePort = {
  async getMine() {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    if (!uid) return null;
    
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    if (error) throw error;
    return data ? mapRow(data) : null;
  },
  
  async upsertMine(p) {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    const email = sess.session?.user?.email ?? p.email ?? null;
    if (!uid) throw new Error('Not authenticated');

    const payload = {
      id: uid,
      email,
      username: p.username ?? null,
      display_name: p.displayName ?? p.username ?? null,
      dietary_prefs: p.dietaryPrefs ?? []
    };

    const { data, error } = await supabase.from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select('*').single();
    if (error) throw error;
    return mapRow(data);
  },
  
  async isUsernameAvailable(username: string) {
    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .ilike('username', username);
    if (error) throw error;
    return (count ?? 0) === 0;
  }
};