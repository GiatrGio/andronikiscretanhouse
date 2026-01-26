import { Metadata } from "next";
import CoursesContent from "./CoursesContent";

export const metadata: Metadata = {
  title: "Cretan Cooking Courses",
  description:
    "Learn authentic Cretan cooking in our traditional courtyard. Hands-on classes using wood-fired oven, fresh garden ingredients, and time-honored family recipes.",
  openGraph: {
    title: "Cretan Cooking Courses | Androniki's Cretan House",
    description:
      "Learn authentic Cretan cooking in our traditional courtyard with wood-fired oven.",
  },
};

export default function CoursesPage() {
  return <CoursesContent />;
}
