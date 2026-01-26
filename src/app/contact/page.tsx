import { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Book your Cretan cooking class or get in touch with us. Located in Loutra, Rethymno, Crete. Call +30 6948247099 or email andronikiscretanhouse@gmail.com.",
  openGraph: {
    title: "Contact Us | Androniki's Cretan House",
    description:
      "Book your Cretan cooking class or get in touch with us.",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
