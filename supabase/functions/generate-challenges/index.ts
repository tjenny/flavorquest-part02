import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeneratedChallenge {
  type: 'eat' | 'drink' | 'cook';
  description: string;
  points: number;
}

interface GeneratedChallengesResponse {
  challenges: GeneratedChallenge[];
}

interface RequestBody {
  stoneTheme: string;
  userDietaryRestrictions?: string[];
  count?: number;
}

// Helper function to randomly select challenges from a larger set
function selectRandomChallenges(challenges: GeneratedChallenge[], requestedCount: number, dietaryRestrictions: string[]): GeneratedChallenge[] {
  let filteredChallenges = challenges;
  
  // Simple dietary filtering (can be enhanced later)
  if (dietaryRestrictions.includes('Vegetarian') || dietaryRestrictions.includes('Vegan')) {
    filteredChallenges = challenges.filter(challenge => 
      !challenge.description.toLowerCase().includes('chicken') &&
      !challenge.description.toLowerCase().includes('beef') &&
      !challenge.description.toLowerCase().includes('pork') &&
      !challenge.description.toLowerCase().includes('fish') &&
      !challenge.description.toLowerCase().includes('crab')
    );
  }
  
  // If filtering removed too many, use original set
  if (filteredChallenges.length === 0) {
    filteredChallenges = challenges;
  }
  
  // Shuffle and take the requested count
  const shuffled = [...filteredChallenges].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(requestedCount, shuffled.length));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { stoneTheme, userDietaryRestrictions = [], count = 3 }: RequestBody = await req.json();

    console.log(`Generating ${count} challenges for theme: ${stoneTheme}, dietary restrictions: ${userDietaryRestrictions.join(', ')}`);

    const restrictionsText = userDietaryRestrictions.length > 0 
      ? userDietaryRestrictions.join(', ') 
      : 'none';

    const prompt = count === 1 
      ? `You must return ONLY a simple dish name. No locations, no instructions, no extra details.

Theme: ${stoneTheme}
Dietary restrictions: ${restrictionsText}

CRITICAL: Return ONLY the dish name (2-4 words maximum). Examples:
- "Spicy Vegetarian Laksa"
- "Teh Tarik" 
- "Sambal Kangkung"
- "Kaya Toast"

DO NOT include:
- Location names (hawker centres, restaurants)
- Instructions (ask for sambal, etc.)
- Addresses or specific places
- Any extra descriptive text

Format as JSON:
{
  "challenges": [
    {
      "type": "eat|drink|cook", 
      "description": "Simple Dish Name",
      "points": 100
    }
  ]
}`
      : `Generate 3 simple food challenges for FlavorQuest app in Singapore.

Theme: ${stoneTheme}
Dietary restrictions: ${restrictionsText}

Requirements:
- Generate SIMPLE dish names only (2-4 words max)
- Include one EAT challenge, one DRINK challenge, one COOK challenge
- Be specific to Singapore's food scene and culture
- Consider dietary restrictions carefully
- Focus on the core dish/drink name without locations or detailed instructions
- Make it similar in style to: "Hainanese Chicken Rice", "Brown Sugar Bubble Tea", "Chili Crab"

Format response as JSON:
{
  "challenges": [
    {
      "type": "eat",
      "description": "Simple dish name",
      "points": 100
    },
    {
      "type": "drink", 
      "description": "Simple drink name",
      "points": 100
    },
    {
      "type": "cook",
      "description": "Simple dish name",
      "points": 100
    }
  ]
}

Examples:
- "Vegetarian Laksa" (for vegetarian restriction)
- "Teh Tarik"
- "Sambal Kangkung"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert on Singapore food culture and cuisine. Generate authentic, specific food challenges that are culturally appropriate and achievable in Singapore.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const responseContent = data.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    console.log('OpenAI response:', responseContent);

    const parsed: GeneratedChallengesResponse = JSON.parse(responseContent);
    
    // Validate basic response structure
    if (!parsed.challenges || !Array.isArray(parsed.challenges) || parsed.challenges.length === 0) {
      throw new Error('Invalid response format from OpenAI - no challenges array found');
    }

    console.log(`OpenAI generated ${parsed.challenges.length} challenges, requested ${count}`);
    
    // If we got more challenges than requested, randomly select the needed count
    let finalChallenges = parsed.challenges;
    if (parsed.challenges.length > count) {
      console.log('Selecting random subset of challenges...');
      finalChallenges = selectRandomChallenges(parsed.challenges, count, userDietaryRestrictions);
    } else if (parsed.challenges.length < count) {
      console.log(`Got fewer challenges than requested (${parsed.challenges.length} vs ${count}), using all available`);
    }

    console.log('Final selected challenges:', finalChallenges);

    const finalResponse: GeneratedChallengesResponse = {
      challenges: finalChallenges
    };

    return new Response(JSON.stringify(finalResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-challenges function:', error);
    
    // Get count from request for fallback (default to 3 if not available)
    let fallbackCount = 3;
    try {
      const body = await req.clone().json();
      fallbackCount = body.count || 3;
    } catch {
      // Use default if can't parse body
    }
    
    console.error('Falling back to default challenges due to error:', error);
    
    // Return simple dish name fallbacks that match expected format
    const fallbackChallenges: GeneratedChallengesResponse = {
      challenges: fallbackCount === 1 
        ? [
            {
              type: "eat",
              description: "Chicken Rice", // Simple dish name without "Try"
              points: 100
            }
          ]
        : [
            {
              type: "eat",
              description: "Chicken Rice",
              points: 100
            },
            {
              type: "drink",
              description: "Teh Tarik",
              points: 100
            },
            {
              type: "cook",
              description: "Fried Rice",
              points: 100
            }
          ]
    };

    return new Response(JSON.stringify(fallbackChallenges), {
      status: 200, // Return 200 with fallback instead of error
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});