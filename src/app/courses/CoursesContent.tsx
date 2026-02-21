"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Clock,
  Users,
  UtensilsCrossed,
  Calendar,
  CalendarCheck,
  Gift,
  Shirt,
  AlertCircle,
  Car,
} from "lucide-react";
import Button from "@/components/ui/Button";
import CourseImageCarousel from "@/components/CourseImageCarousel";
import { COURSE_DETAILS } from "@/lib/constants";
import type { MonthlyTimeSlot, Preferences } from "@/lib/types/preferences";
import { DEFAULT_TIME_SLOTS, generateTimeline, formatMonthRange } from "@/lib/timeSlots";

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDayOrdinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

function formatSeasonFromPreferences(prefs: Preferences): string {
  const start = `${MONTH_NAMES[prefs.season_start_month]} ${formatDayOrdinal(prefs.season_start_day)}`;
  const end = `${MONTH_NAMES[prefs.season_end_month]} ${formatDayOrdinal(prefs.season_end_day)}`;
  return `${start} to ${end}`;
}

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

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

const included = [
  {
    icon: UtensilsCrossed,
    title: "Full Meal & Wine",
    description:
      "Enjoy everything you cook plus local wine and traditional raki",
  },
  {
    icon: Gift,
    title: "Written Recipes",
    description:
      "Take home printed recipes for all dishes you've learned to make",
  },
  {
    icon: Gift,
    title: "Souvenirs",
    description:
      "Traditional Cretan gifts to remember your experience",
  },
];

const goodToKnow = [
  {
    icon: Shirt,
    title: "Dress Comfortably",
    description:
      "Casual clothes you don't mind getting a little messy. We provide aprons!",
  },
  {
    icon: AlertCircle,
    title: "Dietary Restrictions",
    description:
      "Let us know in advance about any allergies or dietary requirements",
  },
  {
    icon: Car,
    title: "Getting Here",
    description:
      "We're located in Loutra, Rethymno. Taxi or rental car recommended",
  },
];

export default function CoursesContent() {
  const [timeSlots, setTimeSlots] = useState<MonthlyTimeSlot[] | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/preferences");
        if (response.ok) {
          const data = await response.json();
          setPreferences(data.preferences);
          setTimeSlots(data.preferences.monthly_time_slots ?? DEFAULT_TIME_SLOTS);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    fetchPreferences();

    const fetchGalleryPhotos = async () => {
      try {
        const response = await fetch("/api/gallery?category=Courses");
        if (response.ok) {
          const data = await response.json();
          setGalleryPhotos(data.photos || []);
        }
      } catch (error) {
        console.error("Error fetching gallery photos:", error);
      }
    };
    fetchGalleryPhotos();
  }, []);

  // Generate timelines for ALL season slots
  const allTimelines = useMemo(() => {
    const slots = timeSlots ?? DEFAULT_TIME_SLOTS;
    return slots.map((slot) => ({
      label: slot.label,
      months: formatMonthRange(slot.months),
      items: generateTimeline(slot.start_time).map((item, i) => ({
        time: item.time,
        ...timelineTitles[i],
      })),
    }));
  }, [timeSlots]);

  const hasMultipleSlots = allTimelines.length > 1;

  // Dynamic season string from preferences
  const seasonValue = useMemo(() => {
    if (preferences) return formatSeasonFromPreferences(preferences);
    return COURSE_DETAILS.season;
  }, [preferences]);

  const keyDetails = useMemo(() => [
    {
      icon: Calendar,
      title: "Season",
      value: seasonValue,
      description: "Classes run during the warm Cretan summer and early autumn",
    },
    {
      icon: Users,
      title: "Group Size",
      value: `Max ${COURSE_DETAILS.maxGroupSize} people`,
      description: `Mixed groups up to ${COURSE_DETAILS.maxGroupSize}, private groups (family/friends) up to ${COURSE_DETAILS.maxPrivateGroupSize}`,
    },
    {
      icon: Clock,
      title: "Duration",
      value: COURSE_DETAILS.duration,
      description: "Including hands-on cooking and a full meal with wine",
    },
    {
      icon: CalendarCheck,
      title: "Booking Deadline",
      value: COURSE_DETAILS.bookingDeadline,
      description: "Please book at least 2 days in advance",
    },
  ], [seasonValue]);

  return (
    <div className="bg-[var(--color-cream)]">
      {/* Introduction */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mb-6">
                Cook with us, eat like a local
              </h2>
              <div className="space-y-4 text-[var(--color-charcoal-light)] text-lg leading-relaxed">
                <p>
                  Step into the flowered courtyard of our traditional Cretan home and let us take you on a
                  journey through our family's heritage.
                  Using our old wood-fired oven—the true heart of Cretan kitchens for centuries—we'll cook
                  together just like our grandmothers used to.
                </p>
                <p>
                  Our recipes are the same ones we enjoy every day: simple, authentic, and always centered
                  around &#39;Cretan gold&#39; (our olive oil) and seasonal veggies.
                </p>
                <p>
                  A Note for our Green Friends: Cretan cuisine is almost vegetarian! This makes our kitchen a
                  welcoming place for everyone—whether you are vegetarian, vegan, or just a lover of fresh greens.
                  We focus on what the earth gives us, so no one ever leaves our table hungry.
                </p>
                <p>
                  And finally, the best part: We'll sit around the big wooden table to enjoy our meal together,
                  sharing stories and a glass of local wine.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="shadow-xl"
            >
              <CourseImageCarousel />
            </motion.div>
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
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-primary)]/20 -translate-x-1/2 hidden md:block" />

            <div className="space-y-8">
              {timelineTitles.map((item, index) => (
                <motion.div
                  key={index}
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
                        {hasMultipleSlots ? (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                            {allTimelines.map((tl) => (
                              <p key={tl.label} className="text-[var(--color-secondary)] font-bold text-sm">
                                {tl.items[index].time}
                                <span className="font-normal text-[var(--color-charcoal-light)] ml-1 text-xs">
                                  ({tl.months})
                                </span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[var(--color-secondary)] font-bold mb-2">
                            {allTimelines[0]?.items[index]?.time}
                          </p>
                        )}
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
                        {hasMultipleSlots ? (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                            {allTimelines.map((tl) => (
                              <p key={tl.label} className="text-[var(--color-secondary)] font-bold text-sm">
                                {tl.items[index].time}
                                <span className="font-normal text-[var(--color-charcoal-light)] ml-1 text-xs">
                                  ({tl.months})
                                </span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[var(--color-secondary)] font-bold mb-2">
                            {allTimelines[0]?.items[index]?.time}
                          </p>
                        )}
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
                    {hasMultipleSlots ? (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                        {allTimelines.map((tl) => (
                          <p key={tl.label} className="text-[var(--color-secondary)] font-bold text-sm">
                            {tl.items[index].time}
                            <span className="font-normal text-[var(--color-charcoal-light)] ml-1 text-xs">
                              ({tl.months})
                            </span>
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[var(--color-secondary)] font-bold mb-2">
                        {allTimelines[0]?.items[index]?.time}
                      </p>
                    )}
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
      {galleryPhotos.length > 0 && (
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
              {galleryPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-primary)]/10 group"
                >
                  <Image
                    src={photo.image_url}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-start p-4">
                    <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {photo.title}
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
      )}

      {/* Key Information */}
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
              Key Information
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyDetails.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-sm font-medium text-[var(--color-charcoal-light)] uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-2">
                  {item.value}
                </p>
                <p className="text-sm text-[var(--color-charcoal-light)]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
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
              What's Included
            </h2>
            <p className="text-lg text-[var(--color-charcoal-light)] max-w-2xl mx-auto">
              Your cooking class includes everything for a complete experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {included.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-[var(--color-secondary)]" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[var(--color-charcoal)] mb-1">
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
      </section>

      {/* Good to Know */}
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
              Good to Know
            </h2>
            <p className="text-lg text-[var(--color-charcoal-light)] max-w-2xl mx-auto">
              A few things to keep in mind for your visit
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {goodToKnow.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[var(--color-charcoal)] mb-2">
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
            <Button
              href="/book-now"
              size="lg"
              className="bg-white !text-[var(--color-secondary)] hover:bg-white/90"
            >
              Book Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
