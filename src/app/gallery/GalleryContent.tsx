"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Filter } from "lucide-react";
import { Lightbox } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const categories = ["All", "The Garden", "Cooking", "Our Dishes", "Happy Guests", "The Venue"];

const galleryImages = [
  {
    id: 1,
    src: "/images/placeholder-1.jpg",
    alt: "Beautiful Cretan courtyard",
    category: "The Venue",
  },
  {
    id: 2,
    src: "/images/placeholder-2.jpg",
    alt: "Hands-on cooking experience",
    category: "Cooking",
  },
  {
    id: 3,
    src: "/images/placeholder-3.jpg",
    alt: "Traditional wood-fired oven",
    category: "The Venue",
  },
  {
    id: 4,
    src: "/images/placeholder-4.jpg",
    alt: "Fresh herbs from the garden",
    category: "The Garden",
  },
  {
    id: 5,
    src: "/images/placeholder-5.jpg",
    alt: "Delicious moussaka",
    category: "Our Dishes",
  },
  {
    id: 6,
    src: "/images/placeholder-6.jpg",
    alt: "Happy guests at the table",
    category: "Happy Guests",
  },
  {
    id: 7,
    src: "/images/placeholder-7.jpg",
    alt: "Organic vegetable garden",
    category: "The Garden",
  },
  {
    id: 8,
    src: "/images/placeholder-8.jpg",
    alt: "Making traditional bread",
    category: "Cooking",
  },
  {
    id: 9,
    src: "/images/placeholder-9.jpg",
    alt: "Traditional dakos salad",
    category: "Our Dishes",
  },
  {
    id: 10,
    src: "/images/placeholder-10.jpg",
    alt: "Guests learning to cook",
    category: "Happy Guests",
  },
  {
    id: 11,
    src: "/images/placeholder-11.jpg",
    alt: "Olive trees in the garden",
    category: "The Garden",
  },
  {
    id: 12,
    src: "/images/placeholder-12.jpg",
    alt: "Fresh homemade cheese",
    category: "Our Dishes",
  },
];

export default function GalleryContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

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
              Photo Gallery
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              A glimpse into the magic of our cooking classes and the beauty of
              Cretan hospitality
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

      {/* Gallery Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <button
                    onClick={() => openLightbox(index)}
                    className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--color-primary)]/10 group cursor-pointer"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-[var(--color-primary)]/30 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-start p-4">
                      <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.alt}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--color-charcoal-light)]">
                No images found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc={filteredImages[currentImageIndex]?.src || ""}
        imageAlt={filteredImages[currentImageIndex]?.alt || ""}
        onPrevious={goToPrevious}
        onNext={goToNext}
        hasPrevious={filteredImages.length > 1}
        hasNext={filteredImages.length > 1}
      />

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
              Ready to Create Your Own Memories?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join us for an authentic Cretan cooking experience
            </p>
            <Button
              href="/contact"
              size="lg"
              className="bg-white text-[var(--color-secondary)] hover:bg-white/90"
            >
              Book Your Experience
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
