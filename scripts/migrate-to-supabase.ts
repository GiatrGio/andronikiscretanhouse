/**
 * Migration script to transfer recipes from JSON files to Supabase
 *
 * Prerequisites:
 * 1. Ensure Supabase project is set up with:
 *    - `recipes` table created (see SQL schema in plan)
 *    - `recipe-images` storage bucket created (public)
 *
 * 2. Set environment variables:
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value;
      }
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables. Please set:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BUCKET_NAME = 'recipe-images';
const RECIPES_DIR = path.join(process.cwd(), 'public', 'recipes');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'recipes');

interface Recipe {
  id: number;
  slug: string;
  title: string;
  summary: string;
  preparation_time: string;
  serves: string;
  difficulty: string;
  category: string;
  main_photo: string;
  ingredients: { group?: string; items: string[] }[];
  instructions: { step: number; type: string; value: string }[];
  tips_and_notes: string[];
}

interface IndexData {
  recipes: {
    id: number;
    slug: string;
    title: string;
  }[];
}

async function uploadImage(
  localPath: string,
  remotePath: string
): Promise<string | null> {
  try {
    if (!fs.existsSync(localPath)) {
      console.log(`  Image not found: ${localPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const contentType = localPath.endsWith('.png')
      ? 'image/png'
      : localPath.endsWith('.webp')
        ? 'image/webp'
        : 'image/jpeg';

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(remotePath, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType,
      });

    if (error) {
      console.error(`  Error uploading ${remotePath}:`, error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    console.error(`  Error uploading ${remotePath}:`, err);
    return null;
  }
}

async function migrateRecipe(recipe: Recipe, newId: number): Promise<boolean> {
  console.log(`\nMigrating recipe: ${recipe.title} (ID: ${recipe.id} -> ${newId})`);

  const updatedRecipe = { ...recipe };

  // Upload main photo
  if (recipe.main_photo && recipe.main_photo.startsWith('/images/recipes/')) {
    const localMainPhotoPath = path.join(
      process.cwd(),
      'public',
      recipe.main_photo
    );
    const remoteMainPhotoPath = `${newId}/main.jpg`;

    console.log(`  Uploading main photo...`);
    const mainPhotoUrl = await uploadImage(localMainPhotoPath, remoteMainPhotoPath);
    if (mainPhotoUrl) {
      updatedRecipe.main_photo = mainPhotoUrl;
      console.log(`  Main photo uploaded: ${mainPhotoUrl}`);
    }
  }

  // Upload instruction photos
  const updatedInstructions = [];
  for (const instruction of recipe.instructions) {
    if (
      instruction.type === 'photo' &&
      instruction.value &&
      instruction.value.startsWith('/images/recipes/')
    ) {
      const localPhotoPath = path.join(
        process.cwd(),
        'public',
        instruction.value
      );
      const fileName = path.basename(instruction.value);
      const remotePhotoPath = `${newId}/${fileName}`;

      console.log(`  Uploading step ${instruction.step} photo...`);
      const photoUrl = await uploadImage(localPhotoPath, remotePhotoPath);
      if (photoUrl) {
        updatedInstructions.push({
          ...instruction,
          value: photoUrl,
        });
        console.log(`  Step photo uploaded: ${photoUrl}`);
      } else {
        updatedInstructions.push(instruction);
      }
    } else {
      updatedInstructions.push(instruction);
    }
  }
  updatedRecipe.instructions = updatedInstructions;

  // Insert into database
  const { error } = await supabase.from('recipes').insert({
    id: newId,
    data: {
      slug: updatedRecipe.slug,
      title: updatedRecipe.title,
      summary: updatedRecipe.summary,
      preparation_time: updatedRecipe.preparation_time,
      serves: updatedRecipe.serves,
      difficulty: updatedRecipe.difficulty,
      category: updatedRecipe.category,
      main_photo: updatedRecipe.main_photo,
      ingredients: updatedRecipe.ingredients,
      instructions: updatedRecipe.instructions,
      tips_and_notes: updatedRecipe.tips_and_notes,
    },
  });

  if (error) {
    console.error(`  Database insert error:`, error.message);
    return false;
  }

  console.log(`  Recipe inserted into database`);
  return true;
}

async function main() {
  console.log('Starting migration to Supabase...\n');

  // Read index.json to get all recipes
  const indexPath = path.join(RECIPES_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('index.json not found in', RECIPES_DIR);
    process.exit(1);
  }

  const indexData: IndexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  console.log(`Found ${indexData.recipes.length} recipes to migrate\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < indexData.recipes.length; i++) {
    const recipeSummary = indexData.recipes[i];
    const recipeFileName = recipeSummary.slug.replace(/-/g, '_') + '.json';
    const recipeFilePath = path.join(RECIPES_DIR, recipeFileName);

    if (!fs.existsSync(recipeFilePath)) {
      console.error(`Recipe file not found: ${recipeFilePath}`);
      failCount++;
      continue;
    }

    const recipe: Recipe = JSON.parse(fs.readFileSync(recipeFilePath, 'utf-8'));
    const newId = i + 1; // Use sequential IDs starting from 1

    const success = await migrateRecipe(recipe, newId);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n========================================');
  console.log('Migration complete!');
  console.log(`  Successful: ${successCount}`);
  console.log(`  Failed: ${failCount}`);
  console.log('========================================\n');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
