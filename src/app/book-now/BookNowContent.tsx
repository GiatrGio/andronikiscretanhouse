"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Clock, Send, Check, ExternalLink, AlertTriangle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input, { Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { BOOKING_PARTNERS } from "@/lib/bookingPartners";
import type { BookingPreferences, DateOverridePublic } from "@/lib/types/preferences";
import { getTimeSlotForMonth, formatTimeSlotRange, formatMonthRange, formatTime24to12 } from "@/lib/timeSlots";

// Format date to YYYY-MM-DD using local timezone (not UTC)
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

export default function BookNowContent() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingPreferences, setBookingPreferences] = useState<BookingPreferences | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success" && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  // Fetch booking preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/preferences");
        if (response.ok) {
          const data: BookingPreferences = await response.json();
          setBookingPreferences(data);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    fetchPreferences();
  }, []);

  const getOverrideForDate = useCallback(
    (dateStr: string): DateOverridePublic | undefined => {
      if (!bookingPreferences) return undefined;
      return bookingPreferences.dateOverrides.find((o) => o.date === dateStr);
    },
    [bookingPreferences]
  );

  const getSpotsForDate = useCallback(
    (date: Date): number => {
      if (!bookingPreferences) return 0;
      const dateStr = formatLocalDate(date);
      const override = getOverrideForDate(dateStr);
      if (override) return override.available_spots;
      return bookingPreferences.preferences.default_spots;
    },
    [bookingPreferences, getOverrideForDate]
  );

  // Date filtering function
  const isDateAvailable = useCallback((date: Date): boolean => {
    if (!bookingPreferences) return true;

    const { preferences, dateOverrides } = bookingPreferences;

    // Check if date is in the past or within the next 2 days
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    minDate.setDate(minDate.getDate() + 2);
    if (date < minDate) return false;

    // Check season (month/day comparison)
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();
    const { season_start_month, season_start_day, season_end_month, season_end_day, available_days } = preferences;

    // Create comparable values (month * 100 + day)
    const dateVal = month * 100 + day;
    const startVal = season_start_month * 100 + season_start_day;
    const endVal = season_end_month * 100 + season_end_day;

    if (dateVal < startVal || dateVal > endVal) return false;

    // Check day of week
    const dayOfWeek = date.getDay(); // 0-6
    if (!available_days.includes(dayOfWeek)) return false;

    // Check if day is closed (available_spots === 0)
    const dateStr = formatLocalDate(date);
    const override = dateOverrides.find((o) => o.date === dateStr);
    if (override && override.available_spots === 0) return false;

    return true;
  }, [bookingPreferences]);

  // Render day contents with spot count for reduced days
  const renderDayContents = useCallback(
    (dayOfMonth: number, date: Date | undefined): React.ReactNode => {
      if (!date || !bookingPreferences) return dayOfMonth;

      const dateStr = formatLocalDate(date);
      const override = getOverrideForDate(dateStr);

      if (override && override.available_spots > 0 && override.available_spots < bookingPreferences.preferences.default_spots) {
        return (
          <div className="flex flex-col items-center leading-tight">
            <span>{dayOfMonth}</span>
            <span className="text-[9px] opacity-70">{override.available_spots} left</span>
          </div>
        );
      }

      return dayOfMonth;
    },
    [bookingPreferences, getOverrideForDate]
  );

  // Day class names for contact calendar
  const getDayClassName = useCallback(
    (date: Date): string => {
      if (!bookingPreferences) return "";

      // Don't color unavailable dates (they stay grey)
      if (!isDateAvailable(date)) return "";

      const dateStr = formatLocalDate(date);
      const override = getOverrideForDate(dateStr);

      if (override && override.available_spots > 0 && override.available_spots < bookingPreferences.preferences.default_spots) {
        return "contact-calendar__day--reduced";
      }

      return "contact-calendar__day--default";
    },
    [bookingPreferences, getOverrideForDate, isDateAvailable]
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      preferredDates: [],
      numberOfGuests: "",
    },
  });

  const watchedDates = useWatch({ control, name: "preferredDates" });
  const watchedGuests = useWatch({ control, name: "numberOfGuests" });

  // Check if any selected date has fewer spots than guest count
  const spotsWarning = (() => {
    if (!bookingPreferences || !watchedDates?.length || !watchedGuests) return null;
    const guestCount = watchedGuests === "9+" ? 9 : parseInt(watchedGuests, 10);
    if (isNaN(guestCount)) return null;

    const problematicDates = watchedDates.filter((date) => {
      const spots = getSpotsForDate(date);
      return spots > 0 && spots < guestCount;
    });

    if (problematicDates.length === 0) return null;

    return problematicDates.map((date) => ({
      date,
      spots: getSpotsForDate(date),
    }));
  })();

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
      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--color-charcoal)] mb-6">
              Book Your Experience
            </h2>

            {status === "success" ? (
              <motion.div
                ref={successRef}
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
                            minDate={(() => { const d = new Date(); d.setDate(d.getDate() + 2); return d; })()}
                            filterDate={isDateAvailable}
                            dayClassName={getDayClassName}
                            renderDayContents={renderDayContents}
                            placeholderText="Click to select dates"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-gray-400"
                            calendarClassName="custom-datepicker"
                          />
                          {/* Time Slots Info Bar */}
                          {bookingPreferences?.preferences.monthly_time_slots &&
                            bookingPreferences.preferences.monthly_time_slots.length > 0 && (
                            <div className="mt-2 p-2.5 bg-[var(--color-primary)]/5 rounded-lg">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                <span className="text-xs font-medium text-[var(--color-charcoal)]">
                                  Course Times
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                {bookingPreferences.preferences.monthly_time_slots.map((slot, i) => (
                                  <div key={i} className="text-xs text-[var(--color-charcoal-light)]">
                                    <span className="font-medium">{slot.label}:</span>{" "}
                                    {formatTimeSlotRange(slot)}{" "}
                                    <span className="opacity-75">
                                      ({formatMonthRange(slot.months)})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {field.value && field.value.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {field.value.map((date, index) => {
                                const spots = getSpotsForDate(date);
                                const defaultSpots = bookingPreferences?.preferences.default_spots ?? 8;
                                const isReduced = spots > 0 && spots < defaultSpots;
                                const timeSlot = bookingPreferences?.preferences.monthly_time_slots
                                  ? getTimeSlotForMonth(bookingPreferences.preferences.monthly_time_slots, date.getMonth() + 1)
                                  : undefined;
                                return (
                                  <div
                                    key={index}
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                                      isReduced
                                        ? "bg-amber-500 text-white"
                                        : "bg-[var(--color-primary)] text-white"
                                    }`}
                                  >
                                    <span>
                                      {date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                      {timeSlot && ` ${formatTime24to12(timeSlot.start_time)}`}
                                      {isReduced && ` (${spots} spots)`}
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
                                );
                              })}
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

                {/* Guest count warning */}
                {spotsWarning && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Limited availability on selected date{spotsWarning.length > 1 ? "s" : ""}
                      </p>
                      <ul className="mt-1 text-sm text-amber-700">
                        {spotsWarning.map(({ date, spots }) => (
                          <li key={date.toISOString()}>
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - only {spots} spot{spots !== 1 ? "s" : ""} available (you selected {watchedGuests} guest{watchedGuests !== "1" ? "s" : ""})
                          </li>
                        ))}
                      </ul>
                      <p className="mt-1 text-xs text-amber-600">
                        We'll do our best to accommodate your group. Please mention this in your message.
                      </p>
                    </div>
                  </div>
                )}

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
        </div>
      </section>
    </div>
  );
}
