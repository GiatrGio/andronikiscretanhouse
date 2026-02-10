"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

export default function GalleryContent() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const response = await fetch("/api/gallery");
        const data = await response.json();
        setPhotos(data.photos || []);
      } catch (error) {
        console.error("Error loading gallery photos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPhotos();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(photos.map((p) => p.category))),
  ];

  const filteredImages =
    selectedCategory === "All"
      ? photos
      : photos.filter((img) => img.category === selectedCategory);

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
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-[var(--color-charcoal-light)]">
                Loading gallery...
              </p>
            </div>
          ) : (
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
                      <Image
                        src={image.image_url}
                        alt={image.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-start p-4">
                        <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {image.title}
                        </p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filteredImages.length === 0 && (
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
        imageSrc={filteredImages[currentImageIndex]?.image_url || ""}
        imageAlt={filteredImages[currentImageIndex]?.title || ""}
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
