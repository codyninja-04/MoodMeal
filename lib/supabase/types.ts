// Placeholder for the generated Supabase types.
// Regenerate against your project with:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
//
// Kept hand-written here so the app type-checks before you wire up a project.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      mood_sessions: {
        Row: {
          id: string;
          user_id: string | null;
          session_token: string | null;
          energy_level: number;
          stress_level: number;
          craving_type: string;
          recommendations: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_token?: string | null;
          energy_level: number;
          stress_level: number;
          craving_type: string;
          recommendations?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_token?: string | null;
          energy_level?: number;
          stress_level?: number;
          craving_type?: string;
          recommendations?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      saved_meals: {
        Row: {
          id: string;
          user_id: string;
          session_id: string | null;
          meal_name: string;
          meal_data: Json;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id?: string | null;
          meal_name: string;
          meal_data: Json;
          saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string | null;
          meal_name?: string;
          meal_data?: Json;
          saved_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          is_premium: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          is_premium?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          is_premium?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      saved_recipes: {
        Row: {
          id: string;
          user_id: string;
          recipe_name: string;
          recipe_data: Json;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_name: string;
          recipe_data: Json;
          saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipe_name?: string;
          recipe_data?: Json;
          saved_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
