import 'server-only';
import fs from 'fs';
import path from 'path';
import { Recipe, RecipeSummary } from './constants';

// Fetch all recipe summaries
export async function getAllRecipes(): Promise<RecipeSummary[]> {
  const filePath = path.join(process.cwd(), 'public', 'recipes', 'index.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data.recipes;
}

// Fetch a single recipe by slug
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const fileName = slug.replace(/-/g, '_');
    const filePath = path.join(process.cwd(), 'public', 'recipes', `${fileName}.json`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error fetching recipe ${slug}:`, error);
    return null;
  }
}

// Get related recipes
export async function getRelatedRecipes(
  currentSlug: string,
  limit: number = 3
): Promise<RecipeSummary[]> {
  const allRecipes = await getAllRecipes();
  const currentRecipe = allRecipes.find((r) => r.slug === currentSlug);

  if (!currentRecipe) return [];

  // Get recipes from the same category, excluding the current one
  const sameCategory = allRecipes.filter(
    (recipe) => recipe.category === currentRecipe.category && recipe.slug !== currentSlug
  );

  // If not enough from same category, add others
  const others = allRecipes.filter(
    (recipe) => recipe.category !== currentRecipe.category && recipe.slug !== currentSlug
  );

  return [...sameCategory, ...others].slice(0, limit);
}
