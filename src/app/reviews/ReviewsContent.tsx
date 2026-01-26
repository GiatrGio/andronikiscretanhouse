"use client";

import { motion } from "framer-motion";
import { Star, Quote, MapPin } from "lucide-react";
import { REVIEWS } from "@/lib/constants";
import Button from "@/components/ui/Button";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsContent() {
  const averageRating =
    REVIEWS.reduce((sum, review) => sum + review.rating, 0) / REVIEWS.length;
  const featuredReviews = REVIEWS.slice(0, 2);
  const otherReviews = REVIEWS.slice(2);

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
              Our Reviews
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              See what our guests have to say about their Cretan cooking
              experience
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold">
                    {averageRating.toFixed(1)}
                  </span>
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-white/80">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">{REVIEWS.length}+</p>
                <p className="text-white/80">Happy Guests</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">100%</p>
                <p className="text-white/80">5-Star Reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Reviews */}
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
              Featured Reviews
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 relative"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-[var(--color-primary)]/10" />
                <StarRating rating={review.rating} />
                <p className="text-lg text-[var(--color-charcoal)] mt-4 mb-6 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[var(--color-charcoal)]">
                      {review.name}
                    </p>
                    <p className="text-sm text-[var(--color-charcoal-light)]">
                      {review.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[var(--color-charcoal-light)]">
                    <MapPin className="w-4 h-4" />
                    {review.country}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Reviews */}
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
              More Reviews
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-[var(--color-cream)] rounded-xl p-6"
              >
                <StarRating rating={review.rating} />
                <p className="text-[var(--color-charcoal)] mt-3 mb-4 line-clamp-4">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-[var(--color-charcoal)]">
                      {review.name}
                    </p>
                    <p className="text-[var(--color-charcoal-light)]">
                      {review.date}
                    </p>
                  </div>
                  <span className="text-[var(--color-charcoal-light)]">
                    {review.country}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leave a Review CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[var(--color-primary)] rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
              Been Our Guest?
            </h2>
            <p className="text-white/90 mb-8">
              We'd love to hear about your experience! Leave us a review on
              TripAdvisor or Google.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/contact"
                className="bg-white text-[var(--color-primary)] hover:bg-white/90"
              >
                Get in Touch
              </Button>
            </div>
          </motion.div>
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
              Create Your Own Memory
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join us for an unforgettable Cretan cooking experience
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
