import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { items }: { items: { id: number; sort_order: number }[] } = await request.json();

    // Update each recipe's sort_order
    for (const item of items) {
      const { error } = await supabase
        .from('recipes')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);

      if (error) {
        throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering recipes:', error);
    return NextResponse.json(
      { error: 'Failed to reorder recipes' },
      { status: 500 }
    );
  }
}
