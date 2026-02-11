import { Metadata } from "next";
import BookNowContent from "./BookNowContent";

export const metadata: Metadata = {
  title: "Book Now",
  description:
    "Book your Cretan cooking class experience. Located in Loutra, Rethymno, Crete. Choose your dates and group size.",
  openGraph: {
    title: "Book Now | Androniki's Cretan House",
    description:
      "Book your Cretan cooking class experience.",
  },
};

export default function BookNowPage() {
  return <BookNowContent />;
}
