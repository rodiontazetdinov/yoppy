import { NextResponse } from 'next/server';
import { generatePetRecommendations, generatePetTasks } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const petInfo = await request.json();

    const [recommendations, tasks] = await Promise.all([
      generatePetRecommendations(petInfo),
      generatePetTasks(petInfo)
    ]);

    return NextResponse.json({ recommendations, tasks });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Не удалось сгенерировать рекомендации. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 