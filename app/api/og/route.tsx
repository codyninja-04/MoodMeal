import { ImageResponse } from 'next/og';
import { decodeMeal } from '@/lib/share';
import { brand } from '@/lib/brand';

// Renders the share card image that link previews unfurl into.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const encoded = searchParams.get('m');
  const meal = encoded ? decodeMeal(encoded) : null;

  const mealName = meal?.meal_name ?? brand.name;
  const reason = meal?.mood_reason ?? brand.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0e0e10',
          padding: '70px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: brand.accentHex,
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          {brand.emoji} {brand.name}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#fafafa',
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            {mealName}
          </div>
          <div
            style={{
              color: '#a1a1aa',
              fontSize: 34,
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            {reason}
          </div>
        </div>

        <div style={{ display: 'flex', color: '#71717a', fontSize: 26 }}>
          Recommended for how you feel
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
