"use client";

import { useState } from "react";
import { X, Plus, Trash2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

export default function AddRecipeModal({ isOpen, onClose, onSuccess }: AddRecipeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [serves, setServes] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [category, setCategory] = useState("");
  const [mainPhoto, setMainPhoto] = useState<File | null>(null);

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

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add basic fields
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("summary", summary);
      formData.append("preparation_time", preparationTime);
      formData.append("serves", serves);
      formData.append("difficulty", difficulty);
      formData.append("category", category);

      // Add main photo
      if (mainPhoto) {
        formData.append("mainPhoto", mainPhoto);
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

      // Add instruction photos
      instructionsData.forEach((inst, index) => {
        inst.photos.forEach((photo, photoIndex) => {
          formData.append(`instruction_${inst.step}_photo_${photoIndex}`, photo);
        });
      });

      // Add tips
      formData.append("tips_and_notes", JSON.stringify(tips.filter(tip => tip.trim() !== "")));

      const response = await fetch("/api/admin/recipes", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setSummary("");
    setPreparationTime("");
    setServes("");
    setDifficulty("Easy");
    setCategory("");
    setMainPhoto(null);
    setIngredientGroups([{ group: "", items: [""] }]);
    setInstructions([{ step: 1, text: "", photos: [] }]);
    setTips([""]);
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
                Add New Recipe
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
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold text-[var(--color-charcoal)]">
                  Basic Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Slug *</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>
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

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prep Time *</label>
                    <input
                      type="text"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(e.target.value)}
                      placeholder="e.g., 30 min"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Serves *</label>
                    <input
                      type="text"
                      value={serves}
                      onChange={(e) => setServes(e.target.value)}
                      placeholder="e.g., 4-6"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty *</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g., Main Courses"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Main Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainPhoto(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
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
                  {isSubmitting ? "Creating..." : "Create Recipe"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
