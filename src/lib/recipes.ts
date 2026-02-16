import 'server-only';
import { Recipe, RecipeSummary } from './constants';
import { createAdminClient } from './supabase/admin';

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(url && key && url.startsWith('http') && key.length > 10);
}

// Use admin client for read operations to avoid cookie issues during static generation
function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please set up your environment variables.');
  }
  return createAdminClient();
}

// Fetch all recipe summaries
export async function getAllRecipes(): Promise<RecipeSummary[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty recipes list');
    return [];
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('id, data')
    .eq('published', true)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return data.map((row) => {
    const recipe = row.data as Recipe;
    return {
      id: row.id,
      slug: recipe.slug,
      title: recipe.title,
      summary: recipe.summary,
      category: recipe.category,
      main_photo: recipe.main_photo,
    };
  });
}

// Fetch a single recipe by ID
export async function getRecipeById(id: number): Promise<Recipe | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning null');
    return null;
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('id, data')
    .eq('id', id)
    .eq('published', true)
    .single();

  if (error || !data) {
    console.error(`Error fetching recipe ${id}:`, error);
    return null;
  }

  const recipe = data.data as Recipe;
  return {
    ...recipe,
    id: data.id,
  };
}

// Get related recipes
export async function getRelatedRecipes(
  currentId: number,
  limit: number = 3
): Promise<RecipeSummary[]> {
  const allRecipes = await getAllRecipes();
  const currentRecipe = allRecipes.find((r) => r.id === currentId);

  if (!currentRecipe) return [];

  // Get recipes from the same category, excluding the current one
  const sameCategory = allRecipes.filter(
    (recipe) => recipe.category === currentRecipe.category && recipe.id !== currentId
  );

  // If not enough from same category, add others
  const others = allRecipes.filter(
    (recipe) => recipe.category !== currentRecipe.category && recipe.id !== currentId
  );

  return [...sameCategory, ...others].slice(0, limit);
}

