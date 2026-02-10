import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('gallery_photos')
      .select('id, title, category, image_url')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ photos: data || [] });
  } catch (error) {
    console.error('Error fetching gallery photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery photos' },
      { status: 500 }
    );
  }
}
