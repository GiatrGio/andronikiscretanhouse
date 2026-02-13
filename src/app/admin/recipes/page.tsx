"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import TableCard from "@/components/admin/cards/TableCard";
import AddRecipeModal from "@/components/admin/AddRecipeModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdmin } from "@/components/admin/AdminContext";

interface RecipeWithId {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  main_photo: string;
  updated_at?: string;
}

export default function RecipesDashboard() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipes, setRecipes] = useState<RecipeWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editRecipeId, setEditRecipeId] = useState<number | null>(null);
  const [deleteRecipeIndex, setDeleteRecipeIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Recipes Dashboard" },
  ];

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/recipes');
      const data = await response.json();
      setRecipes(data.recipes || []);
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

  const handleEdit = (index: number) => {
    const recipe = recipes[index];
    setEditRecipeId(recipe.id);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setDeleteRecipeIndex(index);
  };

  const confirmDelete = async () => {
    if (deleteRecipeIndex === null) return;

    const recipe = recipes[deleteRecipeIndex];
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/recipes/${recipe.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      await loadRecipes();
      setDeleteRecipeIndex(null);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditRecipeId(null);
  };

  // Transform recipes for table display
  const recipeData = recipes.map(recipe => ({
    name: recipe.title,
    category: recipe.category,
    lastUpdated: recipe.updated_at
      ? new Date(recipe.updated_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  }));

  const columns = [
    { key: "name", label: "Recipe Name", className: "font-medium" },
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
          <TableCard
            title="All Recipes"
            columns={columns}
            data={recipeData}
            actions={[
              {
                icon: <ExternalLink className="w-4 h-4 text-gray-600" />,
                onClick: (index: number) => window.open(`/recipes/${recipes[index].id}`, "_blank"),
                title: "View recipe",
              },
              {
                icon: <Pencil className="w-4 h-4 text-blue-600" />,
                onClick: handleEdit,
                title: "Edit recipe",
              },
              {
                icon: <Trash2 className="w-4 h-4 text-red-600" />,
                onClick: handleDelete,
                title: "Delete recipe",
              },
            ]}
          />
        )}
      </div>

      <AddRecipeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleRecipeAdded}
        editMode={!!editRecipeId}
        recipeId={editRecipeId || undefined}
      />

      <ConfirmDialog
        isOpen={deleteRecipeIndex !== null}
        onClose={() => setDeleteRecipeIndex(null)}
        onConfirm={confirmDelete}
        title="Delete Recipe"
        message={
          deleteRecipeIndex !== null
            ? `Are you sure you want to delete "${recipes[deleteRecipeIndex]?.title}"? This action cannot be undone.`
            : ""
        }
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        isDestructive
      />
    </>
  );
}
