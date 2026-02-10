"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ChefHat,
  Flame,
  Leaf,
  Clock,
  Users,
  Heart,
  UtensilsCrossed,
} from "lucide-react";
import Button from "@/components/ui/Button";
import CourseImageCarousel from "@/components/CourseImageCarousel";
import type { MonthlyTimeSlot } from "@/lib/types/preferences";
import { DEFAULT_TIME_SLOTS, getTimeSlotForMonth, generateTimeline } from "@/lib/timeSlots";

const whatYouLearn = [
  {
    icon: UtensilsCrossed,
    title: "Traditional Dishes",
    description:
      "Moussaka, dakos salad, stuffed vegetables, and traditional Cretan specialties",
  },
  {
    icon: Flame,
    title: "Wood Oven Cooking",
    description:
      "Master the art of cooking with a traditional wood-fired oven",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "Use herbs and vegetables straight from our organic garden",
  },
  {
    icon: Heart,
    title: "Family Secrets",
    description:
      "Learn recipes passed down through generations of Cretan families",
  },
];

const timelineTitles = [
  {
    title: "Welcome & Garden Tour",
    description:
      "Meet your hosts, enjoy a welcome drink, and tour our organic garden where we'll pick fresh ingredients for our meal.",
  },
  {
    title: "Cooking Begins",
    description:
      "Roll up your sleeves! We'll prepare 4-5 traditional dishes together, learning techniques and stories behind each recipe.",
  },
  {
    title: "Wood Oven Magic",
    description:
      "Watch as dishes are baked in our traditional wood-fired oven, the heart of Cretan cooking.",
  },
  {
    title: "Dinner Together",
    description:
      "Sit down to enjoy the fruits of your labor with local wine, conversation, and Cretan hospitality.",
  },
  {
    title: "Farewell",
    description:
      "Take home printed recipes and souvenirs to recreate the experience.",
  },
];

const galleryImages = [
  {
    src: "/images/placeholder-courtyard.jpg",
    alt: "Beautiful Cretan courtyard with traditional architecture",
    caption: "Our Traditional Courtyard",
  },
  {
    src: "/images/placeholder-cooking.jpg",
    alt: "Hands-on cooking experience",
    caption: "Hands-on Cooking",
  },
  {
    src: "/images/placeholder-oven.jpg",
    alt: "Traditional wood-fired oven",
    caption: "Wood-Fired Oven",
  },
  {
    src: "/images/placeholder-dishes.jpg",
    alt: "Delicious Cretan dishes",
    caption: "Our Creations",
  },
  {
    src: "/images/placeholder-garden.jpg",
    alt: "Organic herb garden",
    caption: "The Garden",
  },
  {
    src: "/images/placeholder-guests.jpg",
    alt: "Happy guests enjoying the meal",
    caption: "Happy Guests",
  },
];

export default function CoursesContent() {
  const [timeSlots, setTimeSlots] = useState<MonthlyTimeSlot[] | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/preferences");
        if (response.ok) {
          const data = await response.json();
          setTimeSlots(data.preferences.monthly_time_slots ?? DEFAULT_TIME_SLOTS);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    fetchPreferences();
  }, []);

  const currentMonth = new Date().getMonth() + 1;

  const timeline = useMemo(() => {
    const slots = timeSlots ?? DEFAULT_TIME_SLOTS;
    const activeSlot = getTimeSlotForMonth(slots, currentMonth);
    const startTime = activeSlot?.start_time ?? "17:30";
    const computed = generateTimeline(startTime);

    return computed.map((item, i) => ({
      time: item.time,
      ...timelineTitles[i],
    }));
  }, [timeSlots, currentMonth]);

  const activeSlotLabel = useMemo(() => {
    if (!timeSlots || timeSlots.length <= 1) return null;
    const slot = getTimeSlotForMonth(timeSlots, currentMonth);
    return slot?.label ?? null;
  }, [timeSlots, currentMonth]);

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
              Cretan Cooking Courses
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Step into our family home and discover the authentic flavors of
              Crete through hands-on cooking in our traditional courtyard
              kitchen
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mb-6">
                More Than a Cooking Class
              </h2>
              <div className="space-y-4 text-[var(--color-charcoal-light)] text-lg leading-relaxed">
                <p>
                  In the flowered courtyard of our traditional Cretan home in
                  Loutra, Rethymno, we invite you to experience the true essence
                  of Greek hospitality and cuisine.
                </p>
                <p>
                  This is not just a cooking class—it's a journey into our
                  family's heritage. Using a wood-fired oven that has been the
                  heart of Cretan kitchens for centuries, we'll prepare dishes
                  exactly as our grandmothers did.
                </p>
                <p>
                  Every ingredient tells a story: herbs from our garden,
                  olive oil from local groves, and vegetables ripened under
                  the Cretan sun. Together, we'll create a meal that captures
                  the soul of our island.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="shadow-xl"
            >
              <CourseImageCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mb-4">
              What You'll Learn
            </h2>
            <p className="text-lg text-[var(--color-charcoal-light)] max-w-2xl mx-auto">
              Our hands-on classes cover everything from ingredient selection
              to plating, giving you skills to recreate these dishes at home
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatYouLearn.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--color-cream)] rounded-xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-[var(--color-secondary)]" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--color-charcoal-light)]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Experience Timeline */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mb-4">
              Your Evening with Us
            </h2>
            <p className="text-lg text-[var(--color-charcoal-light)] max-w-2xl mx-auto">
              Approximately 4 hours of cooking, learning, and feasting
            </p>
            {activeSlotLabel && (
              <p className="text-sm text-[var(--color-charcoal-light)] mt-2">
                Times shown for {activeSlotLabel}. Times may vary by month.
              </p>
            )}
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-primary)]/20 -translate-x-1/2 hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="md:w-1/2 md:text-right">
                    {index % 2 === 0 ? (
                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <p className="text-[var(--color-secondary)] font-bold mb-2">
                          {item.time}
                        </p>
                        <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-[var(--color-charcoal-light)]">
                          {item.description}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[var(--color-primary)] rounded-full -translate-x-1/2 hidden md:block" />

                  <div className="md:w-1/2">
                    {index % 2 !== 0 ? (
                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <p className="text-[var(--color-secondary)] font-bold mb-2">
                          {item.time}
                        </p>
                        <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-[var(--color-charcoal-light)]">
                          {item.description}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {/* Mobile view */}
                  <div className="md:hidden bg-white rounded-xl p-6 shadow-md ml-8">
                    <p className="text-[var(--color-secondary)] font-bold mb-2">
                      {item.time}
                    </p>
                    <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[var(--color-charcoal-light)]">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mb-4">
              A Glimpse of the Experience
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-primary)]/10 group cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChefHat className="w-12 h-12 text-[var(--color-primary)]/30" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button href="/gallery" variant="outline">
              View Full Gallery
            </Button>
          </div>
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
              Ready to Cook with Us?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Book your spot for an unforgettable evening of Cretan cooking,
              culture, and hospitality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/courses/availability"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[var(--color-secondary)]"
              >
                Check Availability
              </Button>
              <Button
                href="/contact"
                size="lg"
                className="bg-white !text-[var(--color-secondary)] hover:bg-white/90"
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
