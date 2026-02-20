import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadImageFromBuffer } from '@/lib/supabase/storage';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('recipes')
      .select('id, data, published, sort_order, created_at, updated_at')
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    const recipes = data.map((row) => ({
      id: row.id,
      ...row.data,
      published: row.published,
      sort_order: row.sort_order,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const formData = await request.formData();

    // Extract basic fields
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const categoriesJson = formData.get('categories') as string;
    const categories: string[] = JSON.parse(categoriesJson);

    // Get max sort_order for new recipe
    const { data: maxRow } = await supabase
      .from('recipes')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextSortOrder = (maxRow?.sort_order ?? 0) + 1;

    // First, insert the recipe to get the ID
    const { data: insertedRecipe, error: insertError } = await supabase
      .from('recipes')
      .insert({
        data: {
          title,
          summary,
          categories,
          main_photo: '',
          ingredients: [],
          instructions: [],
          tips_and_notes: [],
        },
        sort_order: nextSortOrder,
      })
      .select('id')
      .single();

    if (insertError || !insertedRecipe) {
      throw insertError || new Error('Failed to insert recipe');
    }

    const recipeId = insertedRecipe.id;

    // Handle main photo upload
    let mainPhotoUrl = '';
    const mainPhoto = formData.get('mainPhoto') as File | null;
    if (mainPhoto && mainPhoto.size > 0) {
      const mainPhotoBuffer = Buffer.from(await mainPhoto.arrayBuffer());
      const uploadedUrl = await uploadImageFromBuffer(
        mainPhotoBuffer,
        `${recipeId}/main.jpg`,
        mainPhoto.type
      );
      if (uploadedUrl) {
        mainPhotoUrl = uploadedUrl;
      }
    }

    // Parse ingredients
    const ingredientsJson = formData.get('ingredients') as string;
    const ingredients = JSON.parse(ingredientsJson);

    // Parse instructions
    const instructionsTextJson = formData.get('instructionsText') as string;
    const instructionsText = JSON.parse(instructionsTextJson);

    // Build instructions array with photos
    const instructions: { step: number; type: string; value: string }[] = [];

    for (const inst of instructionsText) {
      // Add text instruction
      instructions.push({
        step: inst.step,
        type: 'text',
        value: inst.text,
      });

      // Check for photos for this step
      let photoIndex = 0;
      while (true) {
        const photoKey = `instruction_${inst.step}_photo_${photoIndex}`;
        const photo = formData.get(photoKey) as File | null;

        if (!photo) break;

        // Upload photo to Supabase Storage
        const photoBuffer = Buffer.from(await photo.arrayBuffer());
        const photoPath = `${recipeId}/step${inst.step}-${photoIndex + 1}.jpg`;
        const photoUrl = await uploadImageFromBuffer(
          photoBuffer,
          photoPath,
          photo.type
        );

        if (photoUrl) {
          instructions.push({
            step: inst.step,
            type: 'photo',
            value: photoUrl,
          });
        }

        photoIndex++;
      }
    }

    // Parse tips
    const tipsJson = formData.get('tips_and_notes') as string;
    const tips_and_notes = JSON.parse(tipsJson);

    // Create recipe data object
    const recipeData = {
      title,
      summary,
      categories,
      main_photo: mainPhotoUrl,
      ingredients,
      instructions,
      tips_and_notes,
    };

    // Update the recipe with full data
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ data: recipeData })
      .eq('id', recipeId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      recipe: { id: recipeId, ...recipeData },
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}
