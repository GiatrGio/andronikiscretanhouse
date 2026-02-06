import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [reviewsResult, contentResult] = await Promise.all([
      supabase
        .from('reviews')
        .select('*')
        .order('review_date', { ascending: false }),
      supabase
        .from('site_content')
        .select('content')
        .eq('id', 'reviews_hero_text')
        .single(),
    ]);

    if (reviewsResult.error) {
      throw reviewsResult.error;
    }

    const reviews = reviewsResult.data || [];
    const heroText = contentResult.data?.content || '';

    return NextResponse.json({
      reviews,
      heroText,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
