export const SITE_NAME = "Androniki's Cretan House";
export const SITE_DESCRIPTION = "Authentic Cretan Cooking Classes in Rethymno, Crete";

export const CONTACT_INFO = {
  phone: "+30 6948247099",
  phoneDisplay: "+30 694 824 7099",
  email: "andronikiscretanhouse@gmail.com",
  address: "Loutra, Rethymno, Crete, Greece",
  season: "April 20 - October 9",
  googleMapsUrl: "https://maps.app.goo.gl/dQDwcsxkPynmpnWP7",
};

export const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About Us" },
  { href: "/recipes", label: "Recipes" },
  { href: "/reviews", label: "Reviews" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/book-now", label: "Book" },
];

export const COURSE_DETAILS = {
  season: "April 20th to October 9th",
  maxGroupSize: 8,
  maxPrivateGroupSize: 12,
  bookingDeadline: "2 days before the event",
  duration: "Approximately 4 hours (including meal)",
  included: ["Written recipes", "Traditional souvenirs", "Full meal with wine"],
};

// Recipe types matching JSON structure
export interface RecipeInstruction {
  step: number;
  type: "text" | "photo";
  value: string;
}

export interface RecipeIngredientGroup {
  group?: string;
  items: string[];
}

export interface RecipeSummary {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  main_photo: string;
}

export interface Recipe extends RecipeSummary {
  ingredients: RecipeIngredientGroup[];
  instructions: RecipeInstruction[];
  tips_and_notes: string[];
}
