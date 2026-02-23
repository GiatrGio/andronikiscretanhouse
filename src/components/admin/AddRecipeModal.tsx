"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Recipe } from "@/lib/constants";
import { compressImage } from "@/lib/imageCompression";

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMode?: boolean;
  recipeId?: number;
}

interface IngredientGroup {
  group: string;
  items: string[];
}

interface InstructionStep {
  step: number;
  text: string;
  photos: File[];
}

export default function AddRecipeModal({ isOpen, onClose, onSuccess, editMode = false, recipeId }: AddRecipeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Basic fields
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [mainPhoto, setMainPhoto] = useState<File | null>(null);

  // Category dropdown
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ingredients
  const [ingredientGroups, setIngredientGroups] = useState<IngredientGroup[]>([
    { group: "", items: [""] }
  ]);

  // Instructions
  const [instructions, setInstructions] = useState<InstructionStep[]>([
    { step: 1, text: "", photos: [] }
  ]);

  // Tips
  const [tips, setTips] = useState<string[]>([""]);

  // Existing photos (edit mode only)
  const [existingMainPhoto, setExistingMainPhoto] = useState("");
  const [existingStepPhotos, setExistingStepPhotos] = useState<Record<number, string[]>>({});

  // Fetch existing categories from recipes
  useEffect(() => {
    if (isOpen) {
      fetch('/api/admin/recipes')
        .then(res => res.json())
        .then(data => {
          const allCats = new Set<string>();
          (data.recipes || []).forEach((r: { categories?: string[] }) => {
            (r.categories || []).forEach((c: string) => allCats.add(c));
          });
          setExistingCategories(Array.from(allCats).sort());
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleCategory = (cat: string) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const addNewCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
      if (!existingCategories.includes(trimmed)) {
        setExistingCategories(prev => [...prev, trimmed].sort());
      }
    }
    setNewCategoryInput("");
  };

  const removeCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
  };

  // Ingredient handlers
  const addIngredientGroup = () => {
    setIngredientGroups([...ingredientGroups, { group: "", items: [""] }]);
  };

  const removeIngredientGroup = (groupIndex: number) => {
    setIngredientGroups(ingredientGroups.filter((_, i) => i !== groupIndex));
  };

  const updateIngredientGroup = (groupIndex: number, field: string, value: string) => {
    const updated = [...ingredientGroups];
    updated[groupIndex] = { ...updated[groupIndex], [field]: value };
    setIngredientGroups(updated);
  };

  const addIngredientItem = (groupIndex: number) => {
    const updated = [...ingredientGroups];
    updated[groupIndex].items.push("");
    setIngredientGroups(updated);
  };

  const removeIngredientItem = (groupIndex: number, itemIndex: number) => {
    const updated = [...ingredientGroups];
    updated[groupIndex].items = updated[groupIndex].items.filter((_, i) => i !== itemIndex);
    setIngredientGroups(updated);
  };

  const updateIngredientItem = (groupIndex: number, itemIndex: number, value: string) => {
    const updated = [...ingredientGroups];
    updated[groupIndex].items[itemIndex] = value;
    setIngredientGroups(updated);
  };

  // Instruction handlers
  const addInstruction = () => {
    setInstructions([...instructions, { step: instructions.length + 1, text: "", photos: [] }]);
  };

  const removeInstruction = (index: number) => {
    const updated = instructions
      .filter((_, i) => i !== index)
      .map((inst, i) => ({ ...inst, step: i + 1 }));
    setInstructions(updated);
  };

  const updateInstructionText = (index: number, text: string) => {
    const updated = [...instructions];
    updated[index].text = text;
    setInstructions(updated);
  };

  const addInstructionPhoto = (index: number, files: FileList | null) => {
    if (!files) return;
    const updated = [...instructions];
    updated[index].photos = [...updated[index].photos, ...Array.from(files)];
    setInstructions(updated);
  };

  const removeInstructionPhoto = (stepIndex: number, photoIndex: number) => {
    const updated = [...instructions];
    updated[stepIndex].photos = updated[stepIndex].photos.filter((_, i) => i !== photoIndex);
    setInstructions(updated);
  };

  // Tips handlers
  const addTip = () => {
    setTips([...tips, ""]);
  };

  const removeTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const updateTip = (index: number, value: string) => {
    const updated = [...tips];
    updated[index] = value;
    setTips(updated);
  };

  // Load recipe data when in edit mode
  useEffect(() => {
    if (editMode && recipeId && isOpen) {
      loadRecipeData();
    } else if (!editMode && isOpen) {
      resetForm();
    }
  }, [editMode, recipeId, isOpen]);

  const loadRecipeData = async () => {
    if (!recipeId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}`);
      const recipe: Recipe & { id: number } = await response.json();

      // Populate form with existing data
      setTitle(recipe.title);
      setSummary(recipe.summary);
      setCategories(recipe.categories || []);

      // Populate ingredients
      const loadedGroups = recipe.ingredients.map(group => ({
        group: group.group || "",
        items: group.items,
      }));
      setIngredientGroups(loadedGroups.length > 0 ? loadedGroups : [{ group: "", items: [""] }]);

      // Populate existing main photo
      setExistingMainPhoto(recipe.main_photo || "");

      // Populate instructions (only text, photos can't be pre-loaded as Files)
      const textInstructions = recipe.instructions.filter(inst => inst.type === "text");
      const loadedInstructions = textInstructions.map(inst => ({
        step: inst.step,
        text: inst.value,
        photos: [],
      }));
      setInstructions(loadedInstructions.length > 0 ? loadedInstructions : [{ step: 1, text: "", photos: [] }]);

      // Populate existing step photos
      const stepPhotos: Record<number, string[]> = {};
      recipe.instructions
        .filter(inst => inst.type === "photo")
        .forEach(inst => {
          if (!stepPhotos[inst.step]) stepPhotos[inst.step] = [];
          stepPhotos[inst.step].push(inst.value);
        });
      setExistingStepPhotos(stepPhotos);

      // Populate tips
      setTips(recipe.tips_and_notes.length > 0 ? recipe.tips_and_notes : [""]);
    } catch (error) {
      console.error("Error loading recipe:", error);
      alert("Failed to load recipe data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add basic fields
      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("categories", JSON.stringify(categories));

      // Add main photo (compressed)
      if (mainPhoto) {
        const compressedMain = await compressImage(mainPhoto);
        formData.append("mainPhoto", compressedMain);
      }

      // Signal main photo removal in edit mode
      if (editMode && !existingMainPhoto && !mainPhoto) {
        formData.append("removeMainPhoto", "true");
      }

      // Add ingredients
      formData.append("ingredients", JSON.stringify(
        ingredientGroups.map(g => ({
          ...(g.group && { group: g.group }),
          items: g.items.filter(item => item.trim() !== "")
        })).filter(g => g.items.length > 0)
      ));

      // Add instructions with photos
      const instructionsData = instructions.filter(inst => inst.text.trim() !== "");
      formData.append("instructionsText", JSON.stringify(instructionsData.map(inst => ({
        step: inst.step,
        text: inst.text
      }))));

      // Add instruction photos (compressed)
      for (const inst of instructionsData) {
        for (let photoIndex = 0; photoIndex < inst.photos.length; photoIndex++) {
          const compressed = await compressImage(inst.photos[photoIndex]);
          formData.append(`instruction_${inst.step}_photo_${photoIndex}`, compressed);
        }
        // Send existing step photos to keep
        if (editMode) {
          const kept = existingStepPhotos[inst.step] || [];
          formData.append(`existingStepPhotos_${inst.step}`, JSON.stringify(kept));
        }
      }

      // Add tips
      formData.append("tips_and_notes", JSON.stringify(tips.filter(tip => tip.trim() !== "")));

      const url = editMode ? `/api/admin/recipes/${recipeId}` : "/api/admin/recipes";
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(editMode ? "Failed to update recipe" : "Failed to create recipe");
      }

      onSuccess();
      onClose();
      if (!editMode) {
        resetForm();
      }
    } catch (error) {
      console.error(editMode ? "Error updating recipe:" : "Error creating recipe:", error);
      alert(editMode ? "Failed to update recipe. Please try again." : "Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setCategories([]);
    setMainPhoto(null);
    setExistingMainPhoto("");
    setExistingStepPhotos({});
    setIngredientGroups([{ group: "", items: [""] }]);
    setInstructions([{ step: 1, text: "", photos: [] }]);
    setTips([""]);
    setNewCategoryInput("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-heading text-2xl font-bold text-[var(--color-charcoal)]">
                {editMode ? "Edit Recipe" : "Add New Recipe"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {isLoading && (
                <div className="text-center py-8">
                  <p className="text-[var(--color-charcoal-light)]">Loading recipe data...</p>
                </div>
              )}

              {!isLoading && (
                <>
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold text-[var(--color-charcoal)]">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Summary *</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                {/* Categories multi-select dropdown */}
                <div ref={dropdownRef}>
                  <label className="block text-sm font-medium mb-1">Categories</label>

                  {/* Selected categories as pills */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {categories.map(cat => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => removeCategory(cat)}
                            className="hover:text-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dropdown trigger */}
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full px-3 py-2 border rounded-lg flex items-center justify-between text-left focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  >
                    <span className="text-gray-500">
                      {categories.length === 0 ? "Select categories..." : "Add more categories..."}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown menu */}
                  {isCategoryDropdownOpen && (
                    <div className="mt-1 border rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto z-20 relative">
                      {existingCategories.map(cat => (
                        <label
                          key={cat}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={categories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          />
                          <span className="text-sm">{cat}</span>
                        </label>
                      ))}

                      {/* Add new category */}
                      <div className="border-t px-3 py-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addNewCategory();
                              }
                            }}
                            placeholder="Add new category..."
                            className="flex-1 px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={addNewCategory}
                            disabled={!newCategoryInput.trim()}
                            className="px-2 py-1 text-sm bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-dark)] disabled:opacity-50 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Main Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainPhoto(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                  {existingMainPhoto && !mainPhoto && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="relative group">
                        <img
                          src={existingMainPhoto}
                          alt="Current main photo"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setExistingMainPhoto("")}
                          className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">Current photo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-[var(--color-charcoal)]">
                    Ingredients
                  </h3>
                  <button
                    type="button"
                    onClick={addIngredientGroup}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Group
                  </button>
                </div>

                {ingredientGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={group.group}
                        onChange={(e) => updateIngredientGroup(groupIndex, "group", e.target.value)}
                        placeholder="Group name (optional)"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                      {ingredientGroups.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredientGroup(groupIndex)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {group.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateIngredientItem(groupIndex, itemIndex, e.target.value)}
                          placeholder="Ingredient"
                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredientItem(groupIndex, itemIndex)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addIngredientItem(groupIndex)}
                      className="text-sm text-[var(--color-primary)] hover:underline"
                    >
                      + Add ingredient
                    </button>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-[var(--color-charcoal)]">
                    Instructions
                  </h3>
                  <button
                    type="button"
                    onClick={addInstruction}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Step
                  </button>
                </div>

                {instructions.map((instruction, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold mt-1">
                        {instruction.step}
                      </span>
                      <textarea
                        value={instruction.text}
                        onChange={(e) => updateInstructionText(index, e.target.value)}
                        placeholder="Instruction text"
                        rows={2}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                      {instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstruction(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Photos (optional)</label>
                      {existingStepPhotos[instruction.step]?.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2">
                          {existingStepPhotos[instruction.step].map((photoUrl, photoIndex) => (
                            <div key={photoIndex} className="relative group">
                              <img
                                src={photoUrl}
                                alt={`Step ${instruction.step} photo ${photoIndex + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setExistingStepPhotos(prev => ({
                                    ...prev,
                                    [instruction.step]: prev[instruction.step].filter((_, i) => i !== photoIndex),
                                  }));
                                }}
                                className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => addInstructionPhoto(index, e.target.files)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      {instruction.photos.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {instruction.photos.map((photo, photoIndex) => (
                            <div key={photoIndex} className="relative group">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-gray-500">{photo.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeInstructionPhoto(index, photoIndex)}
                                className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addInstruction}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  + Add step
                </button>
              </div>

              {/* Tips */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-[var(--color-charcoal)]">
                    Tips & Notes
                  </h3>
                  <button
                    type="button"
                    onClick={addTip}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Tip
                  </button>
                </div>

                {tips.map((tip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => updateTip(index, e.target.value)}
                      placeholder="Tip or note"
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeTip(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTip}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  + Add tip
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? (editMode ? "Updating..." : "Creating...")
                    : (editMode ? "Update Recipe" : "Create Recipe")
                  }
                </button>
              </div>
              </>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
