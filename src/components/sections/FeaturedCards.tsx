"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChefHat, Calendar, Star } from "lucide-react";
import Button from "@/components/ui/Button";

const features = [
  {
    icon: ChefHat,
    title: "Cretan Cooking Courses",
    description:
      "Learn to prepare authentic Cretan dishes in our traditional courtyard kitchen with a wood-fired oven. A hands-on experience you'll never forget.",
    href: "/courses",
    ctaText: "Learn More",
  },
  {
    icon: Calendar,
    title: "Availability & Details",
    description:
      "Classes run April 20th to October 9th. Maximum 8 guests for mixed groups, or up to 12 for private family gatherings.",
    href: "/courses/availability",
    ctaText: "Check Availability",
  },
  {
    icon: Star,
    title: "Our Reviews",
    description:
      '"The best Cretan cooking experience!" - Our guests consistently rate us 5 stars for authentic cuisine, warm hospitality, and unforgettable memories.',
    href: "/reviews",
    ctaText: "Read All Reviews",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function FeaturedCards() {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-cream)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-charcoal)] mb-4">
            Experience Authentic Crete
          </h2>
          <p className="text-lg text-[var(--color-charcoal-light)] max-w-2xl mx-auto">
            Join us for an unforgettable journey into the heart of Cretan cuisine
            and hospitality
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Link href={feature.href} className="block group h-full">
                <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 flex flex-col group-hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-charcoal)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-charcoal-light)] leading-relaxed flex-1 mb-6">
                    {feature.description}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-[var(--color-primary)] font-medium group-hover:gap-2 transition-all">
                      {feature.ctaText}
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
