import { NextResponse } from 'next/server';
import { getRecipe } from '@/lib/claude';

export async function POST(req: Request) {
  try {
    const { mealName, prepTime } = await req.json();

    if (!mealName || typeof mealName !== 'string') {
      return NextResponse.json({ error: 'Missing meal name' }, { status: 400 });
    }

    const recipe = await getRecipe(
      mealName,
      Number.isFinite(prepTime) ? Number(prepTime) : 20
    );
    return NextResponse.json(recipe);
  } catch (err) {
    // Includes malformed Claude JSON — UI shows a friendly retry instead.
    console.error('recipe route error', err);
    return NextResponse.json(
      { error: 'Could not generate recipe' },
      { status: 500 }
    );
  }
}
