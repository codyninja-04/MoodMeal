// White-label config. A wellness brand can rebrand the whole app by setting
// these env vars at build time — name, voice, and accent colour — without
// touching code. Defaults are MoodMeal's own brand.
//
// The accent is stored as space-separated RGB channels so Tailwind's `ember`
// colour (now `rgb(var(--brand-rgb) / <alpha-value>)`) themes everywhere at
// once, including opacity variants like `bg-ember/10`.

export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'MoodMeal',
  tagline:
    process.env.NEXT_PUBLIC_BRAND_TAGLINE ||
    'Eat for how you feel, not what you crave.',
  emoji: process.env.NEXT_PUBLIC_BRAND_EMOJI || '🍜',
  // RGB channels, e.g. "255 107 74". Drives the --brand-rgb CSS variable.
  accentRgb: process.env.NEXT_PUBLIC_BRAND_ACCENT_RGB || '255 107 74',
  // Hex equivalent for contexts that can't read CSS vars (OG image, theme-color).
  accentHex: process.env.NEXT_PUBLIC_BRAND_ACCENT_HEX || '#ff6b4a',
} as const;
