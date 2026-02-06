import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEFAULT_TIME_SLOTS } from '@/lib/timeSlots';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      // If no row exists, return defaults
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          preferences: {
            id: 1,
            season_start_month: 4,
            season_start_day: 20,
            season_end_month: 10,
            season_end_day: 9,
            available_days: [0, 1, 2, 3, 4, 5, 6],
            default_spots: 8,
            monthly_time_slots: DEFAULT_TIME_SLOTS,
            updated_at: new Date().toISOString(),
          },
        });
      }
      throw error;
    }

    return NextResponse.json({
      preferences: {
        ...data,
        default_spots: data.default_spots ?? 8,
        monthly_time_slots: data.monthly_time_slots ?? DEFAULT_TIME_SLOTS,
      },
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const {
      season_start_month,
      season_start_day,
      season_end_month,
      season_end_day,
      available_days,
      default_spots,
      monthly_time_slots,
    } = body;

    // Validate input
    if (
      typeof season_start_month !== 'number' ||
      typeof season_start_day !== 'number' ||
      typeof season_end_month !== 'number' ||
      typeof season_end_day !== 'number' ||
      !Array.isArray(available_days)
    ) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Validate ranges
    if (
      season_start_month < 1 || season_start_month > 12 ||
      season_end_month < 1 || season_end_month > 12 ||
      season_start_day < 1 || season_start_day > 31 ||
      season_end_day < 1 || season_end_day > 31
    ) {
      return NextResponse.json(
        { error: 'Invalid date values' },
        { status: 400 }
      );
    }

    // Validate available_days contains only 0-6
    if (!available_days.every((d: number) => d >= 0 && d <= 6)) {
      return NextResponse.json(
        { error: 'Invalid day values' },
        { status: 400 }
      );
    }

    // Validate default_spots
    const spots = typeof default_spots === 'number' ? default_spots : 8;
    if (spots < 1 || spots > 100) {
      return NextResponse.json(
        { error: 'default_spots must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Validate monthly_time_slots
    if (monthly_time_slots !== undefined) {
      if (!Array.isArray(monthly_time_slots)) {
        return NextResponse.json(
          { error: 'monthly_time_slots must be an array' },
          { status: 400 }
        );
      }
      const timeRegex = /^\d{2}:\d{2}$/;
      for (const slot of monthly_time_slots) {
        if (!slot.label || typeof slot.label !== 'string') {
          return NextResponse.json({ error: 'Each time slot must have a label' }, { status: 400 });
        }
        if (!Array.isArray(slot.months) || !slot.months.every((m: number) => m >= 1 && m <= 12)) {
          return NextResponse.json({ error: 'Invalid months in time slot' }, { status: 400 });
        }
        if (!timeRegex.test(slot.start_time) || !timeRegex.test(slot.end_time)) {
          return NextResponse.json({ error: 'Time must be in HH:MM format' }, { status: 400 });
        }
      }
    }

    // Upsert preferences (update if exists, insert if not)
    const { data, error } = await supabase
      .from('preferences')
      .upsert({
        id: 1,
        season_start_month,
        season_start_day,
        season_end_month,
        season_end_day,
        available_days,
        default_spots: spots,
        monthly_time_slots: monthly_time_slots ?? DEFAULT_TIME_SLOTS,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ preferences: data });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
