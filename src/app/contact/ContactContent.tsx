"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { MapPin, Phone, Mail, Calendar, Clock, Send, Check, ExternalLink } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input, { Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CONTACT_INFO } from "@/lib/constants";
import { BOOKING_PARTNERS } from "@/lib/bookingPartners";

interface FormData {
  name: string;
  email: string;
  phone: string;
  preferredDates: Date[];
  numberOfGuests: string;
  message: string;
  heardAboutUs: string;
}

const guestOptions = [
  { value: "1", label: "1 guest" },
  { value: "2", label: "2 guests" },
  { value: "3", label: "3 guests" },
  { value: "4", label: "4 guests" },
  { value: "5", label: "5 guests" },
  { value: "6", label: "6 guests" },
  { value: "7", label: "7 guests" },
  { value: "8", label: "8 guests" },
  { value: "9+", label: "9+ guests (private group)" },
];

const heardAboutOptions = [
  { value: "", label: "Select an option" },
  { value: "google", label: "Google Search" },
  { value: "tripadvisor", label: "TripAdvisor" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "friend", label: "Friend/Family" },
  { value: "blog", label: "Blog/Article" },
  { value: "other", label: "Other" },
];

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
    value: CONTACT_INFO.season,
    href: null,
    isExternal: false,
  },
];

export default function ContactContent() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      preferredDates: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      // Format dates to ISO strings for API
      const formattedData = {
        ...data,
        preferredDates: data.preferredDates.map((date) => date.toISOString()),
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        setStatus("success");
        reset({ preferredDates: [] });
      } else {
        const result = await response.json();
        setErrorMessage(result.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
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
              Contact Us
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Ready to book your Cretan cooking experience? Get in touch and
              we'll help you plan the perfect visit
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--color-charcoal)] mb-6">
                Book Your Experience
              </h2>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-green-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-700 mb-6">
                    Thank you for your inquiry. We'll get back to you within 24
                    hours to confirm your booking.
                  </p>
                  <Button onClick={() => setStatus("idle")} variant="outline">
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      placeholder="Your name"
                      required
                      error={errors.name?.message}
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      error={errors.email?.message}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      {...register("phone")}
                    />
                    <div className="w-full">
                      <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                        Preferred Date(s)
                      </label>
                      <Controller
                        control={control}
                        name="preferredDates"
                        render={({ field }) => (
                          <div>
                            <DatePicker
                              onChange={(date: Date | null) => {
                                if (date) {
                                  const currentDates = field.value || [];
                                  const dateExists = currentDates.some(
                                    (d) => d.toDateString() === date.toDateString()
                                  );

                                  if (dateExists) {
                                    // Remove date if already selected
                                    field.onChange(
                                      currentDates.filter(
                                        (d) => d.toDateString() !== date.toDateString()
                                      )
                                    );
                                  } else {
                                    // Add date to selection
                                    field.onChange([...currentDates, date]);
                                  }
                                }
                              }}
                              highlightDates={field.value || []}
                              inline={false}
                              minDate={new Date()}
                              placeholderText="Click to select dates"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-gray-400"
                              calendarClassName="custom-datepicker"
                            />
                            {field.value && field.value.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {field.value.map((date, index) => (
                                  <div
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)] text-white rounded-full text-sm"
                                  >
                                    <span>
                                      {date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        field.onChange(
                                          field.value.filter((_, i) => i !== index)
                                        );
                                      }}
                                      className="hover:bg-white/20 rounded-full p-0.5"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Click dates in the calendar to add/remove them
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Select
                      label="Number of Guests"
                      options={guestOptions}
                      placeholder="Select number of guests"
                      {...register("numberOfGuests")}
                    />
                    <Select
                      label="How did you hear about us?"
                      options={heardAboutOptions}
                      {...register("heardAboutUs")}
                    />
                  </div>

                  <Textarea
                    label="Message"
                    placeholder="Tell us about your group, any dietary restrictions, special requests, or questions..."
                    rows={5}
                    required
                    error={errors.message?.message}
                    {...register("message", {
                      required: "Message is required",
                    })}
                  />

                  {status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "loading"}
                    className="w-full md:w-auto"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Message
                      </span>
                    )}
                  </Button>

                  <p className="text-sm text-[var(--color-charcoal-light)]">
                    <Clock className="w-4 h-4 inline mr-1" />
                    We typically respond within 24 hours
                  </p>
                </form>
              )}

              {/* Partner Booking Section */}
              <div className="mt-12 pt-12 border-t border-gray-200">
                <h3 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-charcoal)] mb-6 text-center">
                  Or book your experience through our partners
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BOOKING_PARTNERS.map((partner) => (
                    <a
                      key={partner.name}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden"
                    >
                      <div
                        className="relative h-16 flex items-center justify-center transform -skew-x-6 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: partner.color }}
                      >
                        <div className="flex items-center gap-3 transform skew-x-6">
                          <img
                            src={partner.iconUrl}
                            alt={`${partner.name} logo`}
                            className="w-6 h-6 object-contain bg-white rounded p-0.5"
                          />
                          <span
                            className="font-bold text-lg"
                            style={{ color: partner.textColor }}
                          >
                            {partner.name}
                          </span>
                          <ExternalLink
                            className="w-5 h-5 opacity-80"
                            style={{ color: partner.textColor }}
                          />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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

              {/* Map Placeholder */}
              <div className="relative aspect-video bg-[var(--color-primary)]/10 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[var(--color-primary)]/50 mx-auto mb-2" />
                    <p className="text-[var(--color-charcoal-light)]">
                      Loutra, Rethymno, Crete
                    </p>
                    <a
                      href={CONTACT_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-primary)] font-medium hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* FAQ Teaser */}
              <div className="mt-8 p-6 bg-[var(--color-secondary)]/10 rounded-xl">
                <h3 className="font-heading text-lg font-bold text-[var(--color-charcoal)] mb-2">
                  Questions?
                </h3>
                <p className="text-[var(--color-charcoal-light)] mb-4">
                  Check our Availability & Details page for information about
                  booking, group sizes, and what to expect.
                </p>
                <Button href="/courses/availability" variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
