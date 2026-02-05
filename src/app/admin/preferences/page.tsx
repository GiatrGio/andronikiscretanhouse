"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Calendar as CalendarIcon, FileText } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdmin } from "@/components/admin/AdminContext";
import type { Preferences, DateOverride } from "@/lib/types/preferences";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

function getDaysInMonth(month: number): number[] {
  const daysInMonths: Record<number, number> = {
    1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30,
    7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31,
  };
  return Array.from({ length: daysInMonths[month] }, (_, i) => i + 1);
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PreferencesPage() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Preferences state
  const [seasonStartMonth, setSeasonStartMonth] = useState(4);
  const [seasonStartDay, setSeasonStartDay] = useState(20);
  const [seasonEndMonth, setSeasonEndMonth] = useState(10);
  const [seasonEndDay, setSeasonEndDay] = useState(9);
  const [availableDays, setAvailableDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [defaultSpots, setDefaultSpots] = useState(8);

  // Date overrides state
  const [dateOverrides, setDateOverrides] = useState<DateOverride[]>([]);

  // Editing popover state
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editSpots, setEditSpots] = useState<string>("");
  const [editNote, setEditNote] = useState("");
  const [isSavingOverride, setIsSavingOverride] = useState(false);

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Preferences" },
  ];

  useEffect(() => {
    loadPreferences();
    loadDateOverrides();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/admin/preferences");
      const data = await response.json();
      if (data.preferences) {
        const p: Preferences = data.preferences;
        setSeasonStartMonth(p.season_start_month);
        setSeasonStartDay(p.season_start_day);
        setSeasonEndMonth(p.season_end_month);
        setSeasonEndDay(p.season_end_day);
        setAvailableDays(p.available_days);
        setDefaultSpots(p.default_spots ?? 8);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDateOverrides = async () => {
    try {
      const response = await fetch("/api/admin/date-overrides");
      const data = await response.json();
      setDateOverrides(data.dateOverrides || []);
    } catch (error) {
      console.error("Error loading date overrides:", error);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/admin/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          season_start_month: seasonStartMonth,
          season_start_day: seasonStartDay,
          season_end_month: seasonEndMonth,
          season_end_day: seasonEndDay,
          available_days: availableDays,
          default_spots: defaultSpots,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      setSaveMessage({ type: "success", text: "Preferences saved successfully!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSaveMessage({ type: "error", text: "Failed to save preferences. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (day: number) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const getOverrideForDate = useCallback(
    (dateStr: string): DateOverride | undefined => {
      return dateOverrides.find((o) => o.date === dateStr);
    },
    [dateOverrides]
  );

  const handleDayClick = (date: Date | null) => {
    if (!date) return;
    const dateStr = formatLocalDate(date);
    const existing = getOverrideForDate(dateStr);

    setEditingDate(dateStr);
    setEditSpots(existing?.available_spots !== null && existing?.available_spots !== undefined ? String(existing.available_spots) : "");
    setEditNote(existing?.note || "");
  };

  const saveOverride = async (spots: number | null, note: string) => {
    if (!editingDate) return;
    setIsSavingOverride(true);

    try {
      const response = await fetch("/api/admin/date-overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editingDate,
          available_spots: spots,
          note: note || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      await loadDateOverrides();
      setEditingDate(null);
    } catch (error) {
      console.error("Error saving override:", error);
    } finally {
      setIsSavingOverride(false);
    }
  };

  const closeDay = async () => {
    await saveOverride(0, editNote);
  };

  const saveCustomSpots = async () => {
    const spots = editSpots === "" ? null : parseInt(editSpots, 10);
    if (spots !== null && (isNaN(spots) || spots < 0)) return;
    await saveOverride(spots, editNote);
  };

  const resetDay = async () => {
    if (!editingDate) return;
    setIsSavingOverride(true);

    try {
      const response = await fetch(`/api/admin/date-overrides/${editingDate}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      await loadDateOverrides();
      setEditingDate(null);
    } catch (error) {
      console.error("Error resetting day:", error);
    } finally {
      setIsSavingOverride(false);
    }
  };

  const removeOverride = async (dateStr: string) => {
    try {
      const response = await fetch(`/api/admin/date-overrides/${dateStr}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setDateOverrides((prev) => prev.filter((o) => o.date !== dateStr));
    } catch (error) {
      console.error("Error removing override:", error);
    }
  };

  const isDayAvailable = useCallback(
    (date: Date): boolean => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dateVal = month * 100 + day;
      const startVal = seasonStartMonth * 100 + seasonStartDay;
      const endVal = seasonEndMonth * 100 + seasonEndDay;
      if (dateVal < startVal || dateVal > endVal) return false;
      const dayOfWeek = date.getDay();
      if (!availableDays.includes(dayOfWeek)) return false;
      return true;
    },
    [seasonStartMonth, seasonStartDay, seasonEndMonth, seasonEndDay, availableDays]
  );

  const getDayClassName = useCallback(
    (date: Date): string => {
      if (!isDayAvailable(date)) return "";

      const dateStr = formatLocalDate(date);
      const override = getOverrideForDate(dateStr);

      if (!override) return "booking-calendar__day--default";

      if (override.available_spots === 0) return "booking-calendar__day--closed";
      if (override.available_spots !== null && override.available_spots < defaultSpots) {
        return "booking-calendar__day--reduced";
      }
      return "booking-calendar__day--default";
    },
    [getOverrideForDate, defaultSpots, isDayAvailable]
  );

  const renderDayContents = useCallback(
    (dayOfMonth: number, date: Date | undefined): React.ReactNode => {
      if (!date) return dayOfMonth;

      const dateStr = formatLocalDate(date);
      const override = getOverrideForDate(dateStr);

      const spots = override?.available_spots !== null && override?.available_spots !== undefined
        ? override.available_spots
        : defaultSpots;
      const hasNote = override?.note ? true : false;

      return (
        <div className="flex flex-col items-center leading-tight">
          <span className="text-xs font-medium">{dayOfMonth}</span>
          <span className="text-[10px] opacity-75">{spots === 0 ? "closed" : spots}</span>
          {hasNote && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute top-0.5 right-0.5" />
          )}
        </div>
      );
    },
    [getOverrideForDate, defaultSpots]
  );

  if (isLoading) {
    return (
      <>
        <AdminHeader
          breadcrumbItems={breadcrumbItems}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center py-12">
            <p className="text-[var(--color-charcoal-light)]">Loading preferences...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        breadcrumbItems={breadcrumbItems}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-[var(--color-charcoal)]">
            Preferences
          </h1>
          <p className="text-[var(--color-charcoal-light)] mt-2">
            Manage booking availability settings
          </p>
        </div>

        <div className="space-y-6 max-w-6xl">
          {/* Season Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-4">
              Season Settings
            </h2>
            <p className="text-sm text-[var(--color-charcoal-light)] mb-4">
              Set the start and end dates for your booking season. Dates outside this range will be unavailable.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                  Season Start
                </label>
                <div className="flex gap-3">
                  <select
                    value={seasonStartMonth}
                    onChange={(e) => setSeasonStartMonth(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-2"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={seasonStartDay}
                    onChange={(e) => setSeasonStartDay(Number(e.target.value))}
                    className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-2"
                  >
                    {getDaysInMonth(seasonStartMonth).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                  Season End
                </label>
                <div className="flex gap-3">
                  <select
                    value={seasonEndMonth}
                    onChange={(e) => setSeasonEndMonth(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-2"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={seasonEndDay}
                    onChange={(e) => setSeasonEndDay(Number(e.target.value))}
                    className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-2"
                  >
                    {getDaysInMonth(seasonEndMonth).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Availability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-4">
              Weekly Availability
            </h2>
            <p className="text-sm text-[var(--color-charcoal-light)] mb-4">
              Select which days of the week are available for bookings.
            </p>

            <div className="flex flex-wrap gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    availableDays.includes(day.value)
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-gray-100 text-[var(--color-charcoal)] hover:bg-gray-200"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Default Available Spots */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-4">
              Default Available Spots
            </h2>
            <p className="text-sm text-[var(--color-charcoal-light)] mb-4">
              The default number of spots available per day. Individual days can be overridden in the calendar below.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={100}
                value={defaultSpots}
                onChange={(e) => setDefaultSpots(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-2"
              />
              <span className="text-sm text-[var(--color-charcoal-light)]">spots per day</span>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={savePreferences}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
            {saveMessage && (
              <span
                className={`text-sm ${
                  saveMessage.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {saveMessage.text}
              </span>
            )}
          </div>

          {/* Booking Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-4">
              Booking Calendar
            </h2>
            <p className="text-sm text-[var(--color-charcoal-light)] mb-4">
              Click on any day to set available spots, close the day, or add a note. Days show their spot count.
            </p>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                <span className="text-[var(--color-charcoal-light)]">Default ({defaultSpots} spots)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
                <span className="text-[var(--color-charcoal-light)]">Reduced spots</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-red-200 border border-red-300" />
                <span className="text-[var(--color-charcoal-light)]">Closed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[var(--color-charcoal-light)]">Has note</span>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
              {/* Calendar */}
              <div className="flex-shrink-0 booking-calendar">
                <DatePicker
                  selected={null}
                  onChange={handleDayClick}
                  inline
                  monthsShown={2}
                  minDate={new Date()}
                  filterDate={(date) => {
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    const dateVal = month * 100 + day;
                    const startVal = seasonStartMonth * 100 + seasonStartDay;
                    const endVal = seasonEndMonth * 100 + seasonEndDay;
                    if (dateVal < startVal || dateVal > endVal) return false;
                    const dayOfWeek = date.getDay();
                    if (!availableDays.includes(dayOfWeek)) return false;
                    return true;
                  }}
                  dayClassName={getDayClassName}
                  renderDayContents={renderDayContents}
                  calendarClassName="booking-calendar-inner"
                />
              </div>

              {/* Right side: Popover + Override list */}
              <div className="flex-1 min-w-0">
                {/* Edit Popover */}
                {editingDate && (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg font-bold text-[var(--color-charcoal)]">
                        {new Date(editingDate + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </h3>
                      <button
                        onClick={() => setEditingDate(null)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                          Available Spots
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          placeholder={`Default (${defaultSpots})`}
                          value={editSpots}
                          onChange={(e) => setEditSpots(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-2"
                        />
                        <p className="mt-1 text-xs text-gray-500">Leave empty to use default ({defaultSpots}). Set to 0 to close.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                          Note
                        </label>
                        <textarea
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder="Optional note (e.g., 'Private event')"
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:outline-none focus:ring-2 resize-none"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={saveCustomSpots}
                          disabled={isSavingOverride}
                          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 text-sm"
                        >
                          {isSavingOverride ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={closeDay}
                          disabled={isSavingOverride}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                        >
                          Close Day
                        </button>
                        {getOverrideForDate(editingDate) && (
                          <button
                            onClick={resetDay}
                            disabled={isSavingOverride}
                            className="px-4 py-2 bg-gray-200 text-[var(--color-charcoal)] rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm"
                          >
                            Reset to Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Override List */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="w-5 h-5 text-[var(--color-charcoal-light)]" />
                    <span className="font-medium text-[var(--color-charcoal)]">
                      Date Overrides ({dateOverrides.length})
                    </span>
                  </div>

                  {dateOverrides.length === 0 ? (
                    <p className="text-sm text-[var(--color-charcoal-light)]">
                      No date overrides set. Click on dates in the calendar to customize availability.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {dateOverrides.map((override) => (
                        <div
                          key={override.id}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                            override.available_spots === 0
                              ? "bg-red-50"
                              : override.available_spots !== null && override.available_spots < defaultSpots
                              ? "bg-amber-50"
                              : "bg-green-50"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[var(--color-charcoal)]">
                                {new Date(override.date + "T00:00:00").toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                override.available_spots === 0
                                  ? "bg-red-200 text-red-800"
                                  : override.available_spots !== null
                                  ? "bg-amber-200 text-amber-800"
                                  : "bg-green-200 text-green-800"
                              }`}>
                                {override.available_spots === 0
                                  ? "Closed"
                                  : override.available_spots !== null
                                  ? `${override.available_spots} spots`
                                  : `${defaultSpots} spots`}
                              </span>
                            </div>
                            {override.note && (
                              <div className="flex items-center gap-1 mt-1">
                                <FileText className="w-3 h-3 text-blue-500" />
                                <span className="text-xs text-gray-500 truncate">{override.note}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeOverride(override.date)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded flex-shrink-0 ml-2"
                            title="Remove override"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
