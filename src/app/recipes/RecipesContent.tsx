"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChefHat, Filter, X } from "lucide-react";
import { RECIPES } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const categories = [
  "All",
  "Appetizers",
  "Main Courses",
  "Breads",
  "Preserves",
  "Desserts",
];

const difficultyColors = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800",
};

export default function RecipesContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState<
    (typeof RECIPES)[0] | null
  >(null);

  const filteredRecipes =
    selectedCategory === "All"
      ? RECIPES
      : RECIPES.filter((recipe) => recipe.category === selectedCategory);

  return (
    <div className="bg-[var(--color-cream)]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Greek Traditional Recipes
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover the authentic flavors of Crete with recipes passed down
              through generations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[var(--color-charcoal-light)]">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-cream)] text-[var(--color-charcoal)] hover:bg-[var(--color-primary)]/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="w-full text-left bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative aspect-[4/3] bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <ChefHat className="w-16 h-16 text-[var(--color-primary)]/30 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-bold text-[var(--color-charcoal)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                        {recipe.name}
                      </h3>
                      <p className="text-sm text-[var(--color-charcoal-light)] mb-4 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-[var(--color-charcoal-light)]">
                          <Clock className="w-4 h-4" />
                          {recipe.prepTime}
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            difficultyColors[
                              recipe.difficulty as keyof typeof difficultyColors
                            ]
                          }`}
                        >
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--color-charcoal-light)]">
                No recipes found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recipe Modal */}
      <Modal
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        title={selectedRecipe?.name}
        className="bg-white rounded-xl max-w-2xl w-full"
      >
        {selectedRecipe && (
          <div className="p-6">
            <div className="relative aspect-video bg-[var(--color-primary)]/10 rounded-lg mb-6 flex items-center justify-center">
              <ChefHat className="w-20 h-20 text-[var(--color-primary)]/30" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  difficultyColors[
                    selectedRecipe.difficulty as keyof typeof difficultyColors
                  ]
                }`}
              >
                {selectedRecipe.difficulty}
              </span>
              <div className="flex items-center gap-1 text-sm text-[var(--color-charcoal-light)]">
                <Clock className="w-4 h-4" />
                {selectedRecipe.prepTime}
              </div>
              <span className="text-sm text-[var(--color-charcoal-light)]">
                {selectedRecipe.category}
              </span>
            </div>

            <p className="text-[var(--color-charcoal-light)] mb-6">
              {selectedRecipe.description}
            </p>

            <div className="bg-[var(--color-cream)] rounded-lg p-4 mb-6">
              <p className="text-[var(--color-charcoal)] text-center">
                Want to learn how to make this dish? Join us for a cooking class
                and we'll teach you the authentic techniques and secrets!
              </p>
            </div>

            <div className="flex gap-4">
              <Button href="/contact" className="flex-1">
                Book a Class
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedRecipe(null)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[var(--color-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
              Learn These Recipes in Person
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our cooking class and master the art of Cretan cuisine with
              hands-on guidance
            </p>
            <Button
              href="/courses"
              size="lg"
              className="bg-white text-[var(--color-secondary)] hover:bg-white/90"
            >
              View Our Courses
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
