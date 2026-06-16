import type { MoodContext } from '@/types';

// Translate the raw 1-5 sliders and craving into nutritional language.
// Claude does noticeably better with structured intent than bare numbers,
// so this is where we encode the actual mood-food science before the prompt.
export function mapMoodToNutrition(
  energy: number,
  stress: number,
  craving: string
): MoodContext {
  const energyLabel =
    energy <= 2
      ? 'very low energy, fatigued'
      : energy === 3
        ? 'moderate energy'
        : 'high energy, feeling good';

  const stressLabel =
    stress <= 2
      ? 'calm and relaxed'
      : stress === 3
        ? 'mildly stressed'
        : 'high stress, overwhelmed';

  const nutritionalNeeds: string[] = [];
  const avoidances: string[] = [];

  // Low energy needs slow-release carbs and iron.
  if (energy <= 2) {
    nutritionalNeeds.push(
      'complex carbohydrates',
      'iron-rich foods',
      'B vitamins'
    );
    avoidances.push('high sugar foods that cause crashes');
  }

  // High stress needs magnesium and omega-3s.
  if (stress >= 4) {
    nutritionalNeeds.push(
      'magnesium',
      'omega-3 fatty acids',
      'antioxidants'
    );
    avoidances.push('excess caffeine', 'highly processed foods');
  }

  // High energy state can handle lighter, leaner meals.
  if (energy >= 4) {
    nutritionalNeeds.push('lean protein', 'fresh vegetables');
  }

  // The craving itself is a real signal worth honouring, not overriding.
  if (craving === 'comfort' || craving === 'warm') {
    nutritionalNeeds.push('warm, satisfying textures');
  }

  return { energyLabel, stressLabel, nutritionalNeeds, avoidances };
}
