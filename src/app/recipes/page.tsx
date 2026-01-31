import { Metadata } from "next";
import RecipesContent from "./RecipesContent";
import { getAllRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Greek Traditional Recipes",
  description:
    "Explore authentic Cretan recipes including moussaka, traditional bread, homemade cheeses, and preserves. Learn the flavors of Mediterranean cuisine.",
  openGraph: {
    title: "Greek Traditional Recipes | Androniki's Cretan House",
    description:
      "Explore authentic Cretan recipes from our cooking classes.",
  },
};

export default async function RecipesPage() {
  const recipes = await getAllRecipes();

  return <RecipesContent recipes={recipes} />;
}
