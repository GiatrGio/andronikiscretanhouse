import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('date_overrides')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ dateOverrides: data || [] });
  } catch (error) {
    console.error('Error fetching date overrides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch date overrides' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const { date, available_spots, note } = body;

    if (!date || typeof date !== 'string') {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (available_spots !== null && available_spots !== undefined && (typeof available_spots !== 'number' || available_spots < 0)) {
      return NextResponse.json(
        { error: 'available_spots must be a non-negative number or null' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('date_overrides')
      .upsert(
        {
          date,
          available_spots: available_spots ?? null,
          note: note || null,
        },
        { onConflict: 'date' }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ dateOverride: data });
  } catch (error) {
    console.error('Error saving date override:', error);
    return NextResponse.json(
      { error: 'Failed to save date override' },
      { status: 500 }
    );
  }
}
