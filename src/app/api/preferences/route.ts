import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch preferences (single row table)
    const { data: preferences, error: prefError } = await supabase
      .from('preferences')
      .select('*')
      .eq('id', 1)
      .single();

    if (prefError) {
      // If no row exists, return defaults
      if (prefError.code === 'PGRST116') {
        return NextResponse.json({
          preferences: {
            id: 1,
            season_start_month: 4,
            season_start_day: 20,
            season_end_month: 10,
            season_end_day: 9,
            available_days: [0, 1, 2, 3, 4, 5, 6],
            default_spots: 8,
            updated_at: new Date().toISOString(),
          },
          dateOverrides: [],
        });
      }
      throw prefError;
    }

    const defaultSpots = preferences.default_spots ?? 8;

    // Fetch date overrides (future dates only)
    const today = new Date().toISOString().split('T')[0];
    const { data: overrides, error: overridesError } = await supabase
      .from('date_overrides')
      .select('date, available_spots, note')
      .gte('date', today)
      .order('date', { ascending: true });

    if (overridesError) {
      throw overridesError;
    }

    // Resolve null spots to default
    const dateOverrides = (overrides || []).map((o) => ({
      date: o.date,
      available_spots: o.available_spots ?? defaultSpots,
      note: o.note,
    }));

    return NextResponse.json({
      preferences: {
        ...preferences,
        default_spots: defaultSpots,
      },
      dateOverrides,
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}
