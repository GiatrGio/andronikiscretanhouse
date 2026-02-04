import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import type { TrackPageViewInput } from '@/lib/analytics/types';

export async function POST(request: NextRequest) {
  try {
    const body: TrackPageViewInput = await request.json();

    // Validate required fields
    if (!body.page_path || !body.page_title || !body.session_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize data - ensure we don't store anything we shouldn't
    const pageView = {
      page_path: body.page_path.slice(0, 500), // Limit path length
      page_title: body.page_title.slice(0, 200), // Limit title length
      session_id: body.session_id.slice(0, 100), // Limit session ID length
      referrer_domain: body.referrer_domain?.slice(0, 200) || null,
      country: body.country?.slice(0, 100) || null,
    };

    const supabase = createClient();

    const { error } = await supabase
      .from('analytics_page_views')
      .insert(pageView);

    if (error) {
      console.error('Failed to insert page view:', error);
      return NextResponse.json(
        { error: 'Failed to track page view' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
