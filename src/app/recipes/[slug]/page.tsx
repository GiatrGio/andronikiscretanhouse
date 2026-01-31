import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllRecipes, getRecipeBySlug, getRelatedRecipes } from "@/lib/recipes";
import RecipeDetailContent from "./RecipeDetailContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

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
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const relatedRecipes = await getRelatedRecipes(slug, 3);

  return <RecipeDetailContent recipe={recipe} relatedRecipes={relatedRecipes} />;
}
