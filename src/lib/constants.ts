export const SITE_NAME = "Androniki's Cretan House";
export const SITE_DESCRIPTION = "Authentic Cretan Cooking Classes in Rethymno, Crete";

export const CONTACT_INFO = {
  phone: "+30 6948247099",
  phoneDisplay: "+30 694 824 7099",
  email: "andronikiscretanhouse@gmail.com",
  address: "Loutra, Rethymno, Crete, Greece",
  season: "April 20 - October 9",
  googleMapsUrl: "https://maps.google.com/?q=Loutra+Rethymno+Crete",
};

export const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/courses/availability", label: "Availability" },
  { href: "/about", label: "About Us" },
  { href: "/recipes", label: "Recipes" },
  { href: "/reviews", label: "Reviews" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const COURSE_DETAILS = {
  season: "April 20th to October 9th",
  maxGroupSize: 8,
  maxPrivateGroupSize: 12,
  bookingDeadline: "2 days before the event",
  duration: "Approximately 4 hours (including meal)",
  included: ["Written recipes", "Traditional souvenirs", "Full meal with wine"],
};

export const REVIEWS = [
  {
    id: 1,
    name: "Tanja",
    date: "August 2018",
    rating: 5,
    text: "Great cooking experience! Androniki and Pantelis welcomed us into their beautiful home. We learned to make traditional Cretan dishes and enjoyed a wonderful meal together. Highly recommended!",
    country: "Germany",
  },
  {
    id: 2,
    name: "Catherine V.",
    date: "May 2019",
    rating: 5,
    text: "The best Cretan cooking experience you can find! From the moment we arrived, we felt like family. The food was incredible, the setting was magical, and we left with recipes we'll cherish forever.",
    country: "France",
  },
  {
    id: 3,
    name: "Melnoel22",
    date: "July 2018",
    rating: 5,
    text: "Cretan Cooking Dream! An authentic experience that exceeded all expectations. Learning to cook in the wood oven while surrounded by the beautiful garden was unforgettable.",
    country: "USA",
  },
  {
    id: 4,
    name: "Jennifer",
    date: "September 2019",
    rating: 5,
    text: "A highlight of our trip to Crete! Androniki is a wonderful teacher and her passion for Cretan cuisine shines through. The courtyard setting is absolutely beautiful.",
    country: "UK",
  },
  {
    id: 5,
    name: "Amit",
    date: "September 2019",
    rating: 5,
    text: "Perfect experience from start to finish. We learned so much about Cretan food culture and came away with amazing recipes. The hospitality was second to none.",
    country: "India",
  },
  {
    id: 6,
    name: "Lieke",
    date: "October 2018",
    rating: 5,
    text: "An unforgettable afternoon! The cooking class was hands-on and fun, and the meal we prepared together was delicious. Androniki and Pantelis are wonderful hosts.",
    country: "Netherlands",
  },
  {
    id: 7,
    name: "Zoe",
    date: "July 2020",
    rating: 5,
    text: "Authentic and genuine! This was the most authentic cultural experience we had in Crete. Learning traditional recipes passed down through generations was special.",
    country: "Australia",
  },
];

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
  preparation_time: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  main_photo: string;
}

export interface Recipe extends RecipeSummary {
  serves: string;
  ingredients: RecipeIngredientGroup[];
  instructions: RecipeInstruction[];
  tips_and_notes: string[];
}
