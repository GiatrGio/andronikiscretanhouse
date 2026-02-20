"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ExternalLink, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AdminHeader from "@/components/admin/AdminHeader";
import AddRecipeModal from "@/components/admin/AddRecipeModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdmin } from "@/components/admin/AdminContext";

interface RecipeWithId {
  id: number;
  title: string;
  summary: string;
  categories: string[];
  main_photo: string;
  published: boolean;
  sort_order: number;
  updated_at?: string;
}

function SortableRow({
  recipe,
  index,
  onTogglePublished,
  onEdit,
  onDelete,
}: {
  recipe: RecipeWithId;
  index: number;
  onTogglePublished: (index: number) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: recipe.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-[var(--color-cream)]/30 transition-colors"
    >
      {/* Drag handle */}
      <td className="px-2 py-4 w-10">
        <button
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      {/* Name + actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-charcoal)]">
        <div className="flex items-center gap-2">
          <span>{recipe.title}</span>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => window.open(`/recipes/${recipe.id}`, "_blank")}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="View recipe"
            >
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onEdit(index)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Edit recipe"
            >
              <Pencil className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onDelete(index)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Delete recipe"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </td>
      {/* Categories */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-charcoal)]">
        <div className="flex flex-wrap gap-1">
          {recipe.categories?.map((cat) => (
            <span
              key={cat}
              className="inline-block px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs"
            >
              {cat}
            </span>
          ))}
        </div>
      </td>
      {/* Published toggle */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePublished(index);
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            recipe.published ? "bg-green-500" : "bg-gray-300"
          }`}
          title={
            recipe.published
              ? "Published - click to unpublish"
              : "Unpublished - click to publish"
          }
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              recipe.published ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </td>
      {/* Last Updated */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-charcoal-light)]">
        {recipe.updated_at
          ? new Date(recipe.updated_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]}
      </td>
    </tr>
  );
}

export default function RecipesDashboard() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipes, setRecipes] = useState<RecipeWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editRecipeId, setEditRecipeId] = useState<number | null>(null);
  const [deleteRecipeIndex, setDeleteRecipeIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Recipes Dashboard" },
  ];

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/recipes");
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Error loading recipes:", error);
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

  const togglePublished = async (index: number) => {
    const recipe = recipes[index];
    const newPublished = !recipe.published;

    // Optimistic update
    setRecipes((prev) =>
      prev.map((r, i) => (i === index ? { ...r, published: newPublished } : r))
    );

    try {
      const response = await fetch(`/api/admin/recipes/${recipe.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: newPublished }),
      });

      if (!response.ok) {
        throw new Error("Failed to update published status");
      }
    } catch (error) {
      console.error("Error toggling published:", error);
      // Revert on failure
      setRecipes((prev) =>
        prev.map((r, i) =>
          i === index ? { ...r, published: recipe.published } : r
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = recipes.findIndex((r) => r.id === active.id);
    const newIndex = recipes.findIndex((r) => r.id === over.id);

    const reordered = arrayMove(recipes, oldIndex, newIndex);

    // Assign new sort_order values
    const updated = reordered.map((r, i) => ({ ...r, sort_order: i + 1 }));
    setRecipes(updated);

    // Persist to server
    try {
      await fetch("/api/admin/recipes/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: updated.map((r) => ({ id: r.id, sort_order: r.sort_order })),
        }),
      });
    } catch (error) {
      console.error("Error saving order:", error);
      // Revert
      loadRecipes();
    }
  };

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
            <p className="text-[var(--color-charcoal-light)]">
              Loading recipes...
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-6 border-b border-[var(--color-cream-dark)]">
              <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)]">
                All Recipes
              </h3>
            </div>
            <div className="overflow-x-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <table className="w-full">
                  <thead className="bg-[var(--color-cream)]/50">
                    <tr>
                      <th className="px-2 py-3 w-10" />
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-charcoal)] uppercase tracking-wider">
                        Recipe Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-charcoal)] uppercase tracking-wider">
                        Categories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-charcoal)] uppercase tracking-wider">
                        Published
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-charcoal)] uppercase tracking-wider">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <SortableContext
                    items={recipes.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <tbody className="divide-y divide-[var(--color-cream-dark)]">
                      {recipes.map((recipe, index) => (
                        <SortableRow
                          key={recipe.id}
                          recipe={recipe}
                          index={index}
                          onTogglePublished={togglePublished}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </tbody>
                  </SortableContext>
                </table>
              </DndContext>
            </div>
          </div>
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
