import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { deleteGalleryImage } from '@/lib/supabase/storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const body = await request.json();

    const { title, category } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('gallery_photos')
      .update({
        title,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ photo: data });
  } catch (error) {
    console.error('Error updating gallery photo:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Get the photo to find the storage path
    const { data: photo, error: fetchError } = await supabase
      .from('gallery_photos')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Delete from storage
    if (photo?.storage_path) {
      await deleteGalleryImage(photo.storage_path);
    }

    // Delete from database
    const { error } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery photo' },
      { status: 500 }
    );
  }
}
