"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Calendar, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { CONTACT_INFO } from "@/lib/constants";
import type { BookingPreferences } from "@/lib/types/preferences";

export default function ContactContent() {
  const [seasonDisplay, setSeasonDisplay] = useState(CONTACT_INFO.season);

  // Fetch booking preferences for season display
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/preferences");
        if (response.ok) {
          const data: BookingPreferences = await response.json();

          // Update season display text
          if (data.preferences) {
            const { season_start_month, season_start_day, season_end_month, season_end_day } = data.preferences;
            const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            setSeasonDisplay(`${monthNames[season_start_month]} ${season_start_day} - ${monthNames[season_end_month]} ${season_end_day}`);
          }
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    fetchPreferences();
  }, []);

  // Contact details with dynamic season
  const contactDetails = [
    {
      icon: MapPin,
      title: "Location",
      value: CONTACT_INFO.address,
      href: CONTACT_INFO.googleMapsUrl,
      isExternal: true,
    },
    {
      icon: Phone,
      title: "Phone",
      value: CONTACT_INFO.phoneDisplay,
      href: `tel:${CONTACT_INFO.phone}`,
      isExternal: false,
    },
    {
      icon: Mail,
      title: "Email",
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
      isExternal: false,
    },
    {
      icon: Calendar,
      title: "Season",
      value: seasonDisplay,
      href: null,
      isExternal: false,
    },
  ];

  return (
    <div className="bg-[var(--color-cream)]">
      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--color-charcoal)] mb-6">
              Get in Touch
            </h2>

            <div className="space-y-4 mb-8">
              {contactDetails.map((detail) => (
                <div key={detail.title}>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      target={detail.isExternal ? "_blank" : undefined}
                      rel={detail.isExternal ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                        <detail.icon className="w-6 h-6 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-charcoal-light)]">
                          {detail.title}
                        </p>
                        <p className="text-[var(--color-charcoal)] font-medium">
                          {detail.value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <detail.icon className="w-6 h-6 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-charcoal-light)]">
                          {detail.title}
                        </p>
                        <p className="text-[var(--color-charcoal)] font-medium">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
              <iframe
                src="https://maps.google.com/maps?q=Loutra,+Rethymno,+Crete,+Greece&z=14&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Androniki's Cretan House location"
                className="absolute inset-0 w-full h-full"
              />
              <a
                href={CONTACT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-[var(--color-primary)] hover:bg-white transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>

            {/* Book Now CTA */}
            <div className="mt-8 p-6 bg-[var(--color-secondary)]/10 rounded-xl">
              <h3 className="font-heading text-lg font-bold text-[var(--color-charcoal)] mb-2">
                Ready to Book?
              </h3>
              <p className="text-[var(--color-charcoal-light)] mb-4">
                Book your Cretan cooking experience and we'll get back to you
                within 24 hours.
              </p>
              <Button href="/book-now" variant="outline" size="sm">
                Book Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
