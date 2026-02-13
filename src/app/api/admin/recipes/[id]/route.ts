import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadImageFromBuffer, deleteRecipeImages } from '@/lib/supabase/storage';
import { Recipe } from '@/lib/constants';

// GET - Fetch a single recipe
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('recipes')
      .select('id, data, created_at, updated_at')
      .eq('id', Number(id))
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      ...data.data,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a recipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipeId = Number(id);
    const supabase = createAdminClient();

    // Check if recipe exists
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('id')
      .eq('id', recipeId)
      .single();

    if (fetchError || !existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Delete images from storage
    await deleteRecipeImages(recipeId);

    // Delete recipe from database
    const { error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}

// PUT - Update a recipe
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipeId = Number(id);
    const supabase = createAdminClient();

    // Check if recipe exists
    const { data: existingRecipeRow, error: fetchError } = await supabase
      .from('recipes')
      .select('id, data')
      .eq('id', recipeId)
      .single();

    if (fetchError || !existingRecipeRow) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    const existingRecipe = existingRecipeRow.data as Recipe;

    const formData = await request.formData();

    // Extract form data
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const category = formData.get('category') as string;
    const ingredientsJson = formData.get('ingredients') as string;
    const instructionsTextJson = formData.get('instructionsText') as string;
    const tipsJson = formData.get('tips_and_notes') as string;

    // Parse JSON fields
    const ingredients = JSON.parse(ingredientsJson);
    const instructionsText = JSON.parse(instructionsTextJson);
    const tipsAndNotes = JSON.parse(tipsJson);

    // Handle main photo
    const mainPhotoFile = formData.get('mainPhoto') as File | null;
    const removeMainPhoto = formData.get('removeMainPhoto') as string;
    let mainPhotoUrl = existingRecipe.main_photo;

    if (mainPhotoFile && mainPhotoFile.size > 0) {
      const mainPhotoBuffer = Buffer.from(await mainPhotoFile.arrayBuffer());
      const uploadedUrl = await uploadImageFromBuffer(
        mainPhotoBuffer,
        `${recipeId}/main.jpg`,
        mainPhotoFile.type
      );
      if (uploadedUrl) {
        mainPhotoUrl = uploadedUrl;
      }
    } else if (removeMainPhoto === 'true') {
      mainPhotoUrl = '';
    }

    // Process instructions with photos
    const instructions: { step: number; type: string; value: string }[] = [];

    for (const inst of instructionsText) {
      // Add text instruction
      instructions.push({
        step: inst.step,
        type: 'text',
        value: inst.text,
      });

      // Process photos for this step
      const stepPhotos: File[] = [];
      for (const [key, value] of formData.entries()) {
        if (
          key.startsWith(`instruction_${inst.step}_photo_`) &&
          value instanceof File
        ) {
          stepPhotos.push(value);
        }
      }

      // Keep existing photos that the client says to retain
      const existingStepPhotosJson = formData.get(`existingStepPhotos_${inst.step}`) as string | null;
      if (existingStepPhotosJson) {
        const keptUrls: string[] = JSON.parse(existingStepPhotosJson);
        for (const url of keptUrls) {
          instructions.push({
            step: inst.step,
            type: 'photo',
            value: url,
          });
        }
      }

      // Upload new photos
      for (let i = 0; i < stepPhotos.length; i++) {
        const photoFile = stepPhotos[i];
        const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
        const photoPath = `${recipeId}/step${inst.step}-new${Date.now()}-${i + 1}.jpg`;
        const photoUrl = await uploadImageFromBuffer(
          photoBuffer,
          photoPath,
          photoFile.type
        );

        if (photoUrl) {
          instructions.push({
            step: inst.step,
            type: 'photo',
            value: photoUrl,
          });
        }
      }
    }

    // Build updated recipe data
    const updatedRecipeData = {
      slug: existingRecipe.slug, // Slug stays the same
      title,
      summary,
      category,
      main_photo: mainPhotoUrl,
      ingredients,
      instructions,
      tips_and_notes: tipsAndNotes,
    };

    // Update the recipe
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ data: updatedRecipeData })
      .eq('id', recipeId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      recipe: { id: recipeId, ...updatedRecipeData },
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}
