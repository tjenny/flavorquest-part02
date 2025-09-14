export type DietaryPref = 'Vegetarian' | 'Vegan' | 'Halal' | 'Kosher' | 'Gluten-free' | 'None';

export interface Profile {
  id: string;
  email?: string | null;
  username?: string | null;
  displayName?: string | null;
  dietaryPrefs: DietaryPref[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfilePort {
  getMine(): Promise<Profile | null>;
  upsertMine(p: { email?: string; username?: string; displayName?: string; dietaryPrefs?: DietaryPref[] }): Promise<Profile>;
  isUsernameAvailable(username: string): Promise<boolean>;
}