import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Missing required query parameter: key' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('id', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ content: null });
      }
      throw error;
    }

    return NextResponse.json({ content: data });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const { key, content } = body;

    if (!key || content === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: key, content' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('site_content')
      .upsert({
        id: key,
        content,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ content: data });
  } catch (error) {
    console.error('Error updating site content:', error);
    return NextResponse.json(
      { error: 'Failed to update site content' },
      { status: 500 }
    );
  }
}
