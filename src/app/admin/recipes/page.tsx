"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import TableCard from "@/components/admin/cards/TableCard";
import AddRecipeModal from "@/components/admin/AddRecipeModal";
import { useAdmin } from "@/components/admin/AdminContext";
import { RecipeSummary } from "@/lib/constants";

export default function RecipesDashboard() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Recipes Dashboard" },
  ];

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/recipes/index.json');
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleRecipeAdded = () => {
    loadRecipes();
  };

  // Transform recipes for table display
  const recipeData = recipes.map(recipe => ({
    name: recipe.title,
    views: "N/A", // You can add view tracking later
    difficulty: recipe.difficulty,
    category: recipe.category,
    lastUpdated: new Date().toISOString().split('T')[0],
  }));

  const columns = [
    { key: "name", label: "Recipe Name", className: "font-medium" },
    { key: "views", label: "Views" },
    { key: "difficulty", label: "Difficulty" },
    { key: "category", label: "Category" },
    { key: "lastUpdated", label: "Last Updated", className: "text-[var(--color-charcoal-light)]" },
  ];

  return (
    <>
      <AdminHeader
        breadcrumbItems={breadcrumbItems}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[var(--color-charcoal)]">
              Recipes Dashboard
            </h1>
            <p className="text-[var(--color-charcoal-light)] mt-2">
              Manage and monitor your recipe collection
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Recipe
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-charcoal-light)]">Loading recipes...</p>
          </div>
        ) : (
          <TableCard title="All Recipes" columns={columns} data={recipeData} />
        )}
      </div>

      <AddRecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRecipeAdded}
      />
    </>
  );
}
