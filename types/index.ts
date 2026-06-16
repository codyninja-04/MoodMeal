// Shared types used across the mood flow, recommendations, and places.

export type CravingType =
  | 'light'
  | 'hearty'
  | 'sweet'
  | 'savoury'
  | 'warm'
  | 'cold'
  | 'crunchy'
  | 'comfort';

export interface MoodInput {
  energy: number; // 1..5
  stress: number; // 1..5
  craving: CravingType;
}

export interface MoodContext {
  energyLabel: string;
  stressLabel: string;
  nutritionalNeeds: string[];
  avoidances: string[];
}

export interface MealRecommendation {
  meal_name: string;
  cuisine_type: string;
  mood_reason: string;
  key_nutrients: string[];
  prep_time_minutes: number;
  easy_to_cook: boolean;
  search_term: string;
}

export interface RecommendationResponse {
  recommendations: MealRecommendation[];
}

export interface Restaurant {
  name: string;
  rating: number | null;
  address: string;
  placeId: string;
  openNow: boolean | null;
  priceLevel: number | null;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  ingredients: RecipeIngredient[];
  steps: string[];
  tip: string;
}

// What the /api/recommend route returns to the client.
export interface RecommendResult {
  sessionId: string | null;
  recommendations: MealRecommendation[];
}
