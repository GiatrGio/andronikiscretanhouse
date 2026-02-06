import type { MonthlyTimeSlot } from "@/lib/types/preferences";

export const DEFAULT_TIME_SLOTS: MonthlyTimeSlot[] = [
  {
    label: "Default",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    start_time: "17:30",
    end_time: "21:30",
  },
];

/**
 * Find the time slot that applies to a given month (1-12).
 */
export function getTimeSlotForMonth(
  slots: MonthlyTimeSlot[],
  month: number
): MonthlyTimeSlot | undefined {
  return slots.find((s) => s.months.includes(month)) ?? slots[0];
}

/**
 * Convert "HH:mm" (24h) to "H:MM AM/PM" display format.
 */
export function formatTime24to12(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${suffix}`;
}

/**
 * Generate the 5-stage timeline times based on a start time.
 * Offsets derived from the original hardcoded times:
 *   5:30 -> 6:00 -> 7:30 -> 8:00 -> 9:30
 *   +0   -> +30  -> +120 -> +150 -> +240
 */
export function generateTimeline(
  startTime: string
): { time: string; offsetMinutes: number }[] {
  const offsets = [0, 30, 120, 150, 240];
  const [sH, sM] = startTime.split(":").map(Number);
  const startMinutes = sH * 60 + sM;

  return offsets.map((offset) => {
    const totalMin = startMinutes + offset;
    const h = Math.floor(totalMin / 60) % 24;
    const m = totalMin % 60;
    const time24 = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    return {
      time: formatTime24to12(time24),
      offsetMinutes: offset,
    };
  });
}

/**
 * Format a time slot range for display: "5:30 PM - 9:30 PM"
 */
export function formatTimeSlotRange(slot: MonthlyTimeSlot): string {
  return `${formatTime24to12(slot.start_time)} - ${formatTime24to12(slot.end_time)}`;
}

/**
 * Get month name labels for a time slot's months.
 */
export function formatMonthRange(months: number[]): string {
  const names = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  if (months.length === 0) return "";
  const sorted = [...months].sort((a, b) => a - b);
  if (sorted.length === 1) return names[sorted[0]];

  // Check if months are consecutive
  const isConsecutive = sorted.every((m, i) => i === 0 || m === sorted[i - 1] + 1);
  if (isConsecutive) {
    return `${names[sorted[0]]} - ${names[sorted[sorted.length - 1]]}`;
  }
  return sorted.map((m) => names[m]).join(", ");
}
