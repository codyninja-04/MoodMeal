import Anthropic from '@anthropic-ai/sdk';
import type {
  MoodContext,
  Recipe,
  RecommendationResponse,
} from '@/types';

const client = new Anthropic();

// Claude sometimes wraps JSON in markdown fences despite being told not to.
// Strip them before parsing so a stray ```json never breaks a response.
function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as T;
}

export async function getMealRecommendations(
  moodContext: MoodContext,
  craving: string
): Promise<RecommendationResponse> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a nutritionist and chef recommending meals based on someone's current mood and physical state.

Current state:
- Energy: ${moodContext.energyLabel}
- Stress: ${moodContext.stressLabel}
- Craving: ${craving} food
- Nutritional needs: ${moodContext.nutritionalNeeds.join(', ')}
- Avoid: ${moodContext.avoidances.join(', ') || 'nothing in particular'}

Recommend exactly 3 meals that would genuinely help this person feel better.
Base recommendations on real nutritional science, not just what sounds nice.

The "search_term" must be generic enough to actually return results on a
restaurant map search. Prefer "Japanese fish dish" over "miso-glazed black cod".

Respond ONLY with valid JSON. No markdown, no explanation, just raw JSON.

{
  "recommendations": [
    {
      "meal_name": "<name>",
      "cuisine_type": "<cuisine>",
      "mood_reason": "<one warm, casual sentence: why this meal specifically helps their current state>",
      "key_nutrients": ["<nutrient>", "<nutrient>"],
      "prep_time_minutes": <integer>,
      "easy_to_cook": <boolean>,
      "search_term": "<generic dish to search at a restaurant>"
    }
  ]
}`,
      },
    ],
  });

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';
  return parseJson<RecommendationResponse>(text);
}

export async function getRecipe(
  mealName: string,
  prepTime: number
): Promise<Recipe> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `Give me a simple home recipe for ${mealName} that takes about ${prepTime} minutes.
Keep it to 6 ingredients max and 6 steps max. Real quantities, not vague amounts.

Respond ONLY with valid JSON. No markdown, no preamble.

{
  "ingredients": [
    { "name": "<ingredient>", "quantity": "<amount with unit>" }
  ],
  "steps": ["<step 1>", "<step 2>"],
  "tip": "<one practical cooking tip>"
}`,
      },
    ],
  });

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';
  return parseJson<Recipe>(text);
}
