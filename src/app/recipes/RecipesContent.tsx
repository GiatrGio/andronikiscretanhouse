"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Filter } from "lucide-react";
import { RecipeSummary } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface RecipesContentProps {
  recipes: RecipeSummary[];
}

export default function RecipesContent({ recipes }: RecipesContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    recipes.forEach((r) => r.categories.forEach((c) => cats.add(c)));
    return ["All", ...Array.from(cats).sort()];
  }, [recipes]);

  const filteredRecipes =
    selectedCategory === "All"
      ? recipes
      : recipes.filter((recipe) => recipe.categories.includes(selectedCategory));

  return (
    <div className="bg-[var(--color-cream)]">
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
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative aspect-[4/3] bg-[var(--color-primary)]/10 overflow-hidden">
                      {recipe.main_photo ? (
                        <Image
                          src={recipe.main_photo}
                          alt={recipe.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ChefHat className="w-16 h-16 text-[var(--color-primary)]/30 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-bold text-[var(--color-charcoal)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-[var(--color-charcoal-light)] mb-4 line-clamp-2">
                        {recipe.summary}
                      </p>
                    </div>
                  </Link>
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
