import type { Challenge, ChallengeType } from '@/types/domain';

/**
 * AI-powered challenge generation based on stone theme
 * Generates 2 challenges per stone with proper Singaporean dish names
 * This is a deterministic implementation that mimics the OpenAI API response format
 */
export function generateChallenges(
  stoneId: string,
  theme: string,
  count: number = 2
): Challenge[] {
  // Deterministic AI-generated challenges based on stone theme
  // This mimics the OpenAI API response with proper dish names
  const aiGeneratedChallenges: Record<string, { eat: string[], drink: string[], cook: string[] }> = {
    'traditional Singapore hawker center dishes and drinks': {
      eat: [
        'Char Kway Teow',
        'Hokkien Mee',
        'Bak Chor Mee',
        'Roti Prata',
        'Nasi Lemak',
        'Mee Siam',
        'Lor Mee',
        'Wanton Mee'
      ],
      drink: [
        'Teh Tarik',
        'Kopi O',
        'Bandung',
        'Lime Juice',
        'Sugar Cane Juice',
        'Coconut Water',
        'Barley Water',
        'Chrysanthemum Tea'
      ],
      cook: [
        'Roti Prata',
        'Nasi Lemak',
        'Teh Tarik',
        'Kaya Toast'
      ]
    },
    'traditional and modern Singaporean desserts and sweet treats': {
      eat: [
        'Ice Kachang',
        'Chendol',
        'Tau Huay',
        'Pulut Hitam',
        'Kueh Lapis',
        'Ang Ku Kueh',
        'Pandan Cake',
        'Durian Ice Cream'
      ],
      drink: [
        'Bubble Tea',
        'Milk Tea',
        'Fruit Tea',
        'Smoothie',
        'Fresh Juice',
        'Iced Coffee',
        'Matcha Latte',
        'Taro Milk'
      ],
      cook: [
        'Kueh Lapis',
        'Chendol',
        'Pulut Hitam',
        'Pandan Cake'
      ]
    },
    'spicy Southeast Asian dishes popular in Singapore': {
      eat: [
        'Sambal Stingray',
        'Curry Fish Head',
        'Rendang',
        'Laksa',
        'Mee Goreng',
        'Nasi Goreng',
        'Sambal Kangkung',
        'Otak Otak'
      ],
      drink: [
        'Teh Halia',
        'Ginger Tea',
        'Lemongrass Tea',
        'Tamarind Juice',
        'Calamansi Lime',
        'Sour Plum Drink',
        'Honey Lemon',
        'Mint Tea'
      ],
      cook: [
        'Rendang',
        'Sambal',
        'Curry',
        'Otak Otak'
      ]
    },
    'contemporary fusion cuisine and modern interpretations found in Singapore': {
      eat: [
        'Salted Egg Pasta',
        'Truffle Char Kway Teow',
        'Wagyu Beef Rendang',
        'Foie Gras Prata',
        'Lobster Laksa',
        'Truffle Nasi Lemak',
        'Uni Fried Rice',
        'Wagyu Bak Chor Mee'
      ],
      drink: [
        'Craft Cocktail',
        'Artisanal Coffee',
        'Specialty Tea',
        'Wine Pairing',
        'Craft Beer',
        'Mocktail',
        'Cold Brew',
        'Signature Drink'
      ],
      cook: [
        'Fusion Dish',
        'Modern Recipe',
        'Flavor Experiment',
        'Artistic Plating'
      ]
    }
  };

  const templates = aiGeneratedChallenges[theme] || aiGeneratedChallenges['traditional Singapore hawker center dishes and drinks'];
  const challenges: Challenge[] = [];
  
  // Generate challenges with proper dish names (like the OpenAI API would return)
  for (let i = 0; i < count; i++) {
    const types: ChallengeType[] = ['eat', 'drink', 'cook'];
    const type = types[i % types.length];
    const options = templates[type];
    
    // Use deterministic selection based on stoneId and index for consistency
    const seed = stoneId.charCodeAt(stoneId.length - 1) + i;
    const title = options[seed % options.length];
    
    challenges.push({
      id: `${stoneId}_challenge00${i + 2}`, // AI challenges are 002 and 003
      stoneId,
      type,
      title, // This is the actual dish name (e.g., "Char Kway Teow", "Teh Tarik")
      description: `Try ${title} at a local restaurant`, // Simple, clear description
      points: 100,
      aiHintEligible: true,
      isAIGenerated: true,
    });
  }
  
  console.log(`FQ: Generated ${challenges.length} AI challenges for stone ${stoneId}:`, challenges.map(c => c.title));
  return challenges;
}
