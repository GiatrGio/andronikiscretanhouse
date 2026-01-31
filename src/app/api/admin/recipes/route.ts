import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract basic fields
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const summary = formData.get('summary') as string;
    const preparation_time = formData.get('preparation_time') as string;
    const serves = formData.get('serves') as string;
    const difficulty = formData.get('difficulty') as string;
    const category = formData.get('category') as string;

    // Get the next ID
    const indexPath = path.join(process.cwd(), 'public', 'recipes', 'index.json');
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const nextId = Math.max(...indexData.recipes.map((r: any) => r.id), 0) + 1;

    // Create recipe directory for images
    const recipeImageDir = path.join(process.cwd(), 'public', 'images', 'recipes', slug);
    if (!fs.existsSync(recipeImageDir)) {
      fs.mkdirSync(recipeImageDir, { recursive: true });
    }

    // Handle main photo upload
    let mainPhotoPath = `/images/recipes/${slug}-main.jpg`;
    const mainPhoto = formData.get('mainPhoto') as File | null;
    if (mainPhoto) {
      const mainPhotoBuffer = Buffer.from(await mainPhoto.arrayBuffer());
      const mainPhotoFilePath = path.join(recipeImageDir, 'main.jpg');
      await writeFile(mainPhotoFilePath, mainPhotoBuffer);
      mainPhotoPath = `/images/recipes/${slug}/main.jpg`;
    }

    // Parse ingredients
    const ingredientsJson = formData.get('ingredients') as string;
    const ingredients = JSON.parse(ingredientsJson);

    // Parse instructions
    const instructionsTextJson = formData.get('instructionsText') as string;
    const instructionsText = JSON.parse(instructionsTextJson);

    // Build instructions array with photos
    const instructions: any[] = [];

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

        // Save photo
        const photoBuffer = Buffer.from(await photo.arrayBuffer());
        const photoFileName = `step${inst.step}-${photoIndex + 1}.jpg`;
        const photoFilePath = path.join(recipeImageDir, photoFileName);
        await writeFile(photoFilePath, photoBuffer);

        // Add photo instruction
        instructions.push({
          step: inst.step,
          type: 'photo',
          value: `/images/recipes/${slug}/${photoFileName}`,
        });

        photoIndex++;
      }
    }

    // Parse tips
    const tipsJson = formData.get('tips_and_notes') as string;
    const tips_and_notes = JSON.parse(tipsJson);

    // Create recipe object
    const recipe = {
      id: nextId,
      slug,
      main_photo: mainPhotoPath,
      title,
      summary,
      preparation_time,
      serves,
      difficulty,
      category,
      ingredients,
      instructions,
      tips_and_notes,
    };

    // Save recipe JSON file
    const recipeFileName = slug.replace(/-/g, '_');
    const recipeFilePath = path.join(process.cwd(), 'public', 'recipes', `${recipeFileName}.json`);
    fs.writeFileSync(recipeFilePath, JSON.stringify(recipe, null, 2));

    // Update index.json
    indexData.recipes.push({
      id: nextId,
      slug,
      title,
      summary,
      preparation_time,
      difficulty,
      category,
      main_photo: mainPhotoPath,
    });

    // Sort recipes by id
    indexData.recipes.sort((a: any, b: any) => a.id - b.id);

    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}
