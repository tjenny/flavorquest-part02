import { supabase } from '@/integrations/supabase/client';

export interface GeneratedChallenge {
  type: 'eat' | 'drink' | 'cook';
  description: string;
  points: number;
}

export interface GeneratedChallengesResponse {
  challenges: GeneratedChallenge[];
}

// Generate a single personalized challenge
export async function generateSingleChallenge(
  stoneTheme: string,
  userDietaryRestrictions: string[] = []
): Promise<GeneratedChallenge> {
  try {
    
    const { data, error } = await supabase.functions.invoke('generate-challenges', {
      body: {
        stoneTheme,
        userDietaryRestrictions,
        count: 1 // Only generate 1 challenge
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Failed to generate challenge: ${error.message}`);
    }

    if (!data?.challenges || data.challenges.length === 0) {
      throw new Error('Invalid response from challenge generation service');
    }

    return data.challenges[0];
  } catch (error) {
    console.error('Error generating challenge:', error);
    
    // Return fallback challenge if the service fails
    return {
      type: "eat",
      description: "Try signature dish from this theme at local restaurant",
      points: 100
    };
  }
}

// Generate multiple personalized challenges
export async function generateChallenges(
  stoneTheme: string,
  userDietaryRestrictions: string[] = [],
  count: number = 2
): Promise<GeneratedChallenge[]> {
  try {
    
    const { data, error } = await supabase.functions.invoke('generate-challenges', {
      body: {
        stoneTheme,
        userDietaryRestrictions,
        count
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Failed to generate challenges: ${error.message}`);
    }

    if (!data?.challenges || data.challenges.length === 0) {
      throw new Error('Invalid response from challenge generation service');
    }

    return data.challenges;
  } catch (error) {
    console.error('Error generating challenges:', error);
    
    // Return fallback challenges if the service fails
    return Array(count).fill(0).map((_, index) => ({
      type: "eat" as const,
      description: `Try signature dish ${index + 1} from this theme at local restaurant`,
      points: 100
    }));
  }
}

// These functions are no longer needed but kept for backward compatibility
export const setOpenAIKey = (key: string) => {
  console.warn('setOpenAIKey is deprecated - API key is now managed server-side');
};

export const hasOpenAIKey = (): boolean => {
  return true; // Always return true since we handle this server-side now
};