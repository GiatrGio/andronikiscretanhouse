"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Quote, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";

interface Review {
  id: string;
  name: string;
  review_date: string;
  text: string;
  source: string;
  review_link: string;
  is_featured: boolean;
}

function SourceLink({ source, link }: { source: string; link?: string }) {
  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
      >
        {source}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    );
  }
  return <span>{source}</span>;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function ReviewText({ text, className }: { text: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const checkClamp = useCallback(() => {
    const el = textRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    }
  }, []);

  useEffect(() => {
    checkClamp();
    window.addEventListener("resize", checkClamp);
    return () => window.removeEventListener("resize", checkClamp);
  }, [checkClamp, text]);

  return (
    <div>
      <p
        ref={textRef}
        className={`${className || ""} ${!expanded ? "line-clamp-3" : ""}`}
      >
        &ldquo;{text}&rdquo;
      </p>
      {isClamped && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium mt-1"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function ReviewsContent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredReviews = reviews.filter((r) => r.is_featured);
  const otherReviews = reviews.filter((r) => !r.is_featured);

  return (
    <div className="bg-[var(--color-cream)]">
      {/* Featured Reviews */}
      {featuredReviews.length > 0 && (
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
                  <ReviewText
                    text={review.text}
                    className="text-lg text-[var(--color-charcoal)] mt-4 mb-6 leading-relaxed"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[var(--color-charcoal)]">
                        {review.name}
                      </p>
                      <p className="text-sm text-[var(--color-charcoal-light)]">
                        {formatDate(review.review_date)}
                      </p>
                    </div>
                    <span className="text-sm">
                      <SourceLink source={review.source} link={review.review_link} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More Reviews */}
      {otherReviews.length > 0 && (
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
                  <ReviewText
                    text={review.text}
                    className="text-[var(--color-charcoal)] mt-3 mb-4"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-[var(--color-charcoal)]">
                        {review.name}
                      </p>
                      <p className="text-[var(--color-charcoal-light)]">
                        {formatDate(review.review_date)}
                      </p>
                    </div>
                    <span className="text-sm">
                      <SourceLink source={review.source} link={review.review_link} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-24 text-center">
          <p className="text-[var(--color-charcoal-light)]">
            Loading reviews...
          </p>
        </div>
      )}

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
              We&apos;d love to hear about your experience! Leave us a review on
              TripAdvisor or Google.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/contact"
                className="bg-white !text-[var(--color-primary)] hover:bg-white/90"
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
              href="/book-now"
              size="lg"
              className="bg-white !text-[var(--color-secondary)] hover:bg-white/90"
            >
              Book Your Experience
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
