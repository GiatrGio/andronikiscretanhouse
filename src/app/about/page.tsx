import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Androniki & Pantelis, your hosts for authentic Cretan cooking experiences. Learn about our family, traditions, and passion for sharing Greek cuisine.",
  openGraph: {
    title: "About Us | Androniki's Cretan House",
    description:
      "Meet your hosts and learn about our family's passion for Cretan cuisine.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
