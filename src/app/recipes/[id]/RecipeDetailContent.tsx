"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  ArrowLeft,
  Lightbulb,
  X,
} from "lucide-react";
import { Recipe, RecipeSummary } from "@/lib/constants";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";

interface RecipeDetailContentProps {
  recipe: Recipe;
  relatedRecipes: RecipeSummary[];
}

export default function RecipeDetailContent({
  recipe,
  relatedRecipes,
}: RecipeDetailContentProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  return (
    <div className="bg-[var(--color-cream)] min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Recipes", href: "/recipes" },
              { label: recipe.title },
            ]}
          />

          {/* Back Button + Category Pills */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Recipes
            </Link>
            {recipe.categories && recipe.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-end">
                {recipe.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recipe Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[16/9] bg-[var(--color-primary)]/10 rounded-2xl overflow-hidden mb-8 flex items-center justify-center"
          >
            {recipe.main_photo && !imageErrors.has(recipe.main_photo) ? (
              <Image
                src={recipe.main_photo}
                alt={recipe.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
                onError={() => {
                  setImageErrors(prev => new Set(prev).add(recipe.main_photo));
                }}
              />
            ) : (
              <ChefHat className="w-24 h-24 text-[var(--color-primary)]/30" />
            )}
          </motion.div>

          {/* Recipe Title and Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-charcoal)] mb-4">
              {recipe.title}
            </h1>
            <p className="text-lg text-[var(--color-charcoal-light)] max-w-2xl mx-auto">
              {recipe.summary}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ingredients and Instructions */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Ingredients - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md sticky top-24">
                <h2 className="font-heading text-2xl font-bold text-[var(--color-charcoal)] mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <ChefHat className="w-4 h-4 text-[var(--color-primary)]" />
                  </span>
                  What you will need
                </h2>

                {recipe.ingredients.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-6 last:mb-0">
                    {group.group && (
                      <h3 className="font-medium text-[var(--color-charcoal)] mb-3 pb-2 border-b border-[var(--color-cream-dark)]">
                        {group.group}
                      </h3>
                    )}
                    <ul className="space-y-2">
                      {group.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start gap-3 text-[var(--color-charcoal-light)]"
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Instructions - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
                <h2 className="font-heading text-2xl font-bold text-[var(--color-charcoal)] mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center">
                    <span className="text-[var(--color-secondary)] text-sm font-bold">
                      1
                    </span>
                  </span>
                  The recipe step to step
                </h2>

                <ol className="space-y-6">
                  {(() => {
                    // Group instructions by step number
                    const stepMap = new Map<number, { text?: string; photos: string[] }>();

                    recipe.instructions.forEach((instruction) => {
                      if (!stepMap.has(instruction.step)) {
                        stepMap.set(instruction.step, { photos: [] });
                      }
                      const step = stepMap.get(instruction.step)!;

                      if (instruction.type === "text") {
                        step.text = instruction.value;
                      } else if (instruction.type === "photo" && instruction.value) {
                        // Only add non-empty photo paths
                        step.photos.push(instruction.value);
                      }
                    });

                    // Convert to sorted array
                    const steps = Array.from(stepMap.entries())
                      .sort(([a], [b]) => a - b)
                      .map(([stepNum, stepData]) => ({ stepNum, ...stepData }));

                    return steps.map(({ stepNum, text, photos }) => (
                      <li key={stepNum} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">
                          {stepNum}
                        </span>
                        <div className="flex-1">
                          {text && (
                            <p className="text-[var(--color-charcoal-light)] leading-relaxed pt-1 mb-3">
                              {text}
                            </p>
                          )}
                          {photos.length > 0 && (
                            <div
                              className={`grid gap-3 ${
                                photos.length === 2
                                  ? "grid-cols-2"
                                  : "grid-cols-1"
                              }`}
                            >
                              {photos.map((photo, imgIndex) => (
                                <button
                                  key={imgIndex}
                                  onClick={() => setLightboxImage(photo)}
                                  className="relative aspect-[4/3] bg-[var(--color-primary)]/10 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group flex items-center justify-center"
                                >
                                  {!imageErrors.has(photo) ? (
                                    <Image
                                      src={photo}
                                      alt={`Step ${stepNum} - Photo ${imgIndex + 1}`}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                                            onError={() => {
                                        setImageErrors(prev => new Set(prev).add(photo));
                                      }}
                                    />
                                  ) : (
                                    <ChefHat className="w-12 h-12 text-[var(--color-primary)]/30" />
                                  )}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <span className="text-white/0 group-hover:text-white/90 text-sm font-medium transition-all drop-shadow-lg">
                                      Click to enlarge
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ));
                  })()}
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">
                      <ChefHat className="w-4 h-4" />
                    </span>
                    <p className="font-heading text-lg md:text-xl text-[var(--color-primary)] italic pt-1">
                      Bon Appetite - Kali orexi
                    </p>
                  </li>
                </ol>
              </div>

              {/* Tips Section */}
              {recipe.tips_and_notes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-8 bg-[var(--color-accent)]/10 rounded-2xl p-6 md:p-8 border border-[var(--color-accent)]/20"
                >
                  <h2 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[var(--color-accent)]" />
                    Tips & Notes
                  </h2>
                  <ul className="space-y-3">
                    {recipe.tips_and_notes.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-[var(--color-charcoal-light)]"
                      >
                        <span className="text-[var(--color-accent)] font-bold">
                          •
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </div>

        </div>
      </section>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--color-charcoal)] mb-8 text-center">
                You Might Also Like
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedRecipes.map((relatedRecipe, index) => (
                  <motion.div
                    key={relatedRecipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/recipes/${relatedRecipe.id}`}
                      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      <div className="relative aspect-[4/3] bg-[var(--color-primary)]/10 flex items-center justify-center">
                        {relatedRecipe.main_photo && !imageErrors.has(relatedRecipe.main_photo) ? (
                          <Image
                            src={relatedRecipe.main_photo}
                            alt={relatedRecipe.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 33vw"
                                        onError={() => {
                              setImageErrors(prev => new Set(prev).add(relatedRecipe.main_photo));
                            }}
                          />
                        ) : (
                          <ChefHat className="w-12 h-12 text-[var(--color-primary)]/30 group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-lg font-bold text-[var(--color-charcoal)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                          {relatedRecipe.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button href="/recipes" variant="outline">
                  View All Recipes
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt="Recipe step enlarged"
                fill
                className="object-contain rounded-lg"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
