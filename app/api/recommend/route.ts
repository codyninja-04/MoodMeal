import { NextResponse } from 'next/server';
import { getMealRecommendations } from '@/lib/claude';
import { mapMoodToNutrition } from '@/lib/mood-map';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { getOrCreateSessionToken } from '@/lib/session';
import type { Json } from '@/lib/supabase/types';
import type { CravingType, RecommendResult } from '@/types';

const VALID_CRAVINGS: CravingType[] = [
  'light',
  'hearty',
  'sweet',
  'savoury',
  'warm',
  'cold',
  'crunchy',
  'comfort',
];

export async function POST(req: Request) {
  try {
    const { energy, stress, craving, exclude } = await req.json();

    // Validate the inputs match the DB constraints before doing any work.
    const energyNum = Number(energy);
    const stressNum = Number(stress);
    if (
      !Number.isInteger(energyNum) ||
      energyNum < 1 ||
      energyNum > 5 ||
      !Number.isInteger(stressNum) ||
      stressNum < 1 ||
      stressNum > 5 ||
      !VALID_CRAVINGS.includes(craving)
    ) {
      return NextResponse.json({ error: 'Invalid mood input' }, { status: 400 });
    }

    const excludeList = Array.isArray(exclude)
      ? exclude.filter((m: unknown): m is string => typeof m === 'string')
      : [];

    const moodContext = mapMoodToNutrition(energyNum, stressNum, craving);
    const { recommendations } = await getMealRecommendations(
      moodContext,
      craving,
      excludeList
    );

    // Persist the session when Supabase is configured. The token cookie ties
    // anonymous check-ins together; absence of a project shouldn't break the
    // core experience, so we just skip the write otherwise.
    let sessionId: string | null = null;
    if (isSupabaseConfigured()) {
      try {
        const token = getOrCreateSessionToken();
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from('mood_sessions')
          .insert({
            user_id: user?.id ?? null,
            session_token: token,
            energy_level: energyNum,
            stress_level: stressNum,
            craving_type: craving,
            // Stored as jsonb; cast the typed shape into the column's Json type.
            recommendations: recommendations as unknown as Json,
          })
          .select('id')
          .single();

        if (!error && data) sessionId = data.id;
      } catch (dbErr) {
        // Don't fail the request over a logging write.
        console.error('mood_session insert failed', dbErr);
      }
    }

    const result: RecommendResult = { sessionId, recommendations };
    return NextResponse.json(result);
  } catch (err) {
    // Catches malformed Claude JSON too — never surface the raw error.
    console.error('recommend route error', err);
    return NextResponse.json(
      { error: 'Could not generate recommendations' },
      { status: 500 }
    );
  }
}
