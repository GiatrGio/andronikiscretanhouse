import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadGalleryImage } from '@/lib/supabase/storage';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
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

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const formData = await request.formData();

    const metadataStr = formData.get('metadata') as string;
    if (!metadataStr) {
      return NextResponse.json(
        { error: 'Missing metadata' },
        { status: 400 }
      );
    }

    const metadata: { title: string; category: string }[] = JSON.parse(metadataStr);
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length !== metadata.length) {
      return NextResponse.json(
        { error: 'Metadata count does not match file count' },
        { status: 400 }
      );
    }

    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { title, category } = metadata[i];

      if (!title || !category) {
        return NextResponse.json(
          { error: `Missing title or category for file ${i + 1}` },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const ext = file.name.split('.').pop() || 'jpg';
      const storagePath = `${timestamp}-${i}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      const imageUrl = await uploadGalleryImage(buffer, storagePath, file.type);

      if (!imageUrl) {
        return NextResponse.json(
          { error: `Failed to upload file: ${file.name}` },
          { status: 500 }
        );
      }

      const { data, error } = await supabase
        .from('gallery_photos')
        .insert({
          title,
          category,
          storage_path: storagePath,
          image_url: imageUrl,
          sort_order: 0,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting gallery photo:', error);
        return NextResponse.json(
          { error: `Failed to save photo: ${file.name}` },
          { status: 500 }
        );
      }

      results.push(data);
    }

    return NextResponse.json({ photos: results });
  } catch (error) {
    console.error('Error creating gallery photos:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery photos' },
      { status: 500 }
    );
  }
}
