"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Leaf, Users, Award } from "lucide-react";
import Button from "@/components/ui/Button";

const values = [
  {
    icon: Heart,
    title: "Passion for Tradition",
    description:
      "Every recipe we share has been passed down through generations, keeping authentic Cretan flavors alive.",
  },
  {
    icon: Leaf,
    title: "Local & Sustainable",
    description:
      "We use ingredients from our garden and local producers, supporting our community and the environment.",
  },
  {
    icon: Users,
    title: "True Hospitality",
    description:
      "In Crete, guests are family. We open our home and hearts to share our culture and traditions.",
  },
  {
    icon: Award,
    title: "Authentic Experience",
    description:
      "No shortcuts, no compromises. We cook the way Cretans have cooked for centuries.",
  },
];

export default function AboutContent() {
  return (
    <div className="bg-[var(--color-cream)]">
      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-[var(--color-charcoal-light)] text-lg leading-relaxed">
                <p>
                  We are Androniki and Pantelis, and we've called this beautiful
                  corner of Crete our home for our entire lives. Our love for
                  Cretan cuisine began in childhood, watching our grandmothers
                  prepare feasts in their wood-fired ovens.
                </p>
                <p>
                  Years ago, we began inviting visitors into our home to share
                  the cooking traditions that mean so much to us. What started
                  as casual gatherings with friends became something more—a way
                  to preserve our heritage and share it with the world.
                </p>
                <p>
                  Today, our courtyard has welcomed guests from every corner of
                  the globe. Each class is a celebration of Cretan culture:
                  the recipes, the ingredients, the stories, and most
                  importantly, the warmth of gathering around a table with new
                  friends.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image
                src="/images/about/about_1.jpg"
                alt="Androniki and Pantelis"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
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
              Our Philosophy
            </h2>
            <p className="text-lg text-[var(--color-charcoal-light)] max-w-2xl mx-auto">
              What drives everything we do in our kitchen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[var(--color-secondary)]" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-2">
                  {value.title}
                </h3>
                <p className="text-[var(--color-charcoal-light)]">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Home */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image
                src="/images/about/about_2.jpg"
                alt="Our traditional Cretan home"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mb-6">
                Our Home
              </h2>
              <div className="space-y-4 text-[var(--color-charcoal-light)] text-lg leading-relaxed">
                <p>
                  Our home in Loutra, Rethymno, is a traditional Cretan house
                  with a spacious courtyard that becomes our open-air kitchen
                  during classes. The centerpiece is our wood-fired oven, built
                  using methods unchanged for generations.
                </p>
                <p>
                  Surrounding the courtyard is our garden, where we grow the
                  herbs, vegetables, and fruits that find their way into our
                  dishes. From fresh oregano to ripe tomatoes, everything is
                  organic and picked at its peak.
                </p>
                <p>
                  When you visit, you're not coming to a restaurant or a
                  commercial kitchen—you're coming to our home, to cook and
                  dine as our family has for generations.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[var(--color-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
              Come Cook with Us
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We can't wait to welcome you to our home and share our love for
              Cretan cooking
            </p>
            <Button
              href="/contact"
              size="lg"
              className="bg-white !text-[var(--color-primary)] hover:bg-white/90"
            >
              Get in Touch
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
