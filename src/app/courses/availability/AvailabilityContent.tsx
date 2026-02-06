"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Clock,
  Gift,
  CalendarCheck,
  Shirt,
  UtensilsCrossed,
  Car,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { COURSE_DETAILS } from "@/lib/constants";
import type { MonthlyTimeSlot } from "@/lib/types/preferences";
import { DEFAULT_TIME_SLOTS, formatTimeSlotRange, formatMonthRange } from "@/lib/timeSlots";

const keyDetails = [
  {
    icon: Calendar,
    title: "Season",
    value: COURSE_DETAILS.season,
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
];

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

const whatToBring = [
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

export default function AvailabilityContent() {
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
              Availability & Details
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Everything you need to know before booking your Cretan cooking
              experience
            </p>
          </motion.div>
        </div>
      </section>

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

      {/* Course Times */}
      {timeSlots && timeSlots.length > 0 && (
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
                Course Times
              </h2>
              <p className="text-lg text-[var(--color-charcoal-light)] max-w-2xl mx-auto">
                Times vary throughout the season
              </p>
            </motion.div>

            <div className={`grid gap-6 max-w-3xl mx-auto ${timeSlots.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1 max-w-md"}`}>
              {timeSlots.map((slot, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[var(--color-cream)] rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-2">
                    {slot.label}
                  </h3>
                  <p className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                    {formatTimeSlotRange(slot)}
                  </p>
                  <p className="text-sm text-[var(--color-charcoal-light)]">
                    {formatMonthRange(slot.months)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What's Included */}
      <section className={`py-16 md:py-24 ${timeSlots && timeSlots.length > 0 ? "" : "bg-white"}`}>
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

      {/* What to Bring / Expect */}
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
            {whatToBring.map((item, index) => (
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

      {/* Booking Notice */}
      <section className="py-16 md:py-24 bg-[var(--color-primary)]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-[var(--color-secondary)]" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--color-charcoal)] mb-4">
              How to Book
            </h2>
            <p className="text-lg text-[var(--color-charcoal-light)] mb-8 max-w-2xl mx-auto">
              Contact us with your preferred date(s), number of guests, and any
              dietary requirements. We'll confirm availability and provide all
              the details you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg">
                Contact Us to Book
              </Button>
              <Button
                href="/courses"
                variant="outline"
                size="lg"
              >
                Back to Courses
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
