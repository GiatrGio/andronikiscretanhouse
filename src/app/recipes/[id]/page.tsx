import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecipeById, getRelatedRecipes } from "@/lib/recipes";
import RecipeDetailContent from "./RecipeDetailContent";

// Use dynamic rendering since we're fetching from Supabase
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipeById(Number(id));

  if (!recipe) {
    return {
      title: "Recipe Not Found",
    };
  }

  return {
    title: recipe.title,
    description: recipe.summary,
    openGraph: {
      title: `${recipe.title} | Androniki's Cretan House`,
      description: recipe.summary,
      type: "article",
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipeById(Number(id));

  if (!recipe) {
    notFound();
  }

  const relatedRecipes = await getRelatedRecipes(recipe.id, 3);

  return <RecipeDetailContent recipe={recipe} relatedRecipes={relatedRecipes} />;
}
