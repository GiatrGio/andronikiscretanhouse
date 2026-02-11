import { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Androniki's Cretan House. Located in Loutra, Rethymno, Crete. Call +30 6948247099 or email andronikiscretanhouse@gmail.com.",
  openGraph: {
    title: "Contact Us | Androniki's Cretan House",
    description:
      "Get in touch with Androniki's Cretan House.",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
