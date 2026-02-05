export interface Preferences {
  id: number;
  season_start_month: number;
  season_start_day: number;
  season_end_month: number;
  season_end_day: number;
  available_days: number[];
  default_spots: number;
  updated_at: string;
}

export interface DateOverride {
  id: string;
  date: string; // YYYY-MM-DD
  available_spots: number | null; // NULL = use default, 0 = closed
  note: string | null;
  created_at: string;
}

export interface DateOverridePublic {
  date: string; // YYYY-MM-DD
  available_spots: number; // resolved (never null)
  note: string | null;
}

export interface BookingPreferences {
  preferences: Preferences;
  dateOverrides: DateOverridePublic[];
}
