import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('review_date', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const { name, review_date, text, source, is_featured, review_link } = body;

    if (!name || !review_date || !text || !source) {
      return NextResponse.json(
        { error: 'Missing required fields: name, review_date, text, source' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        name,
        review_date,
        text,
        source,
        is_featured: is_featured ?? false,
        review_link: review_link || '',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ review: data });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
