import { Metadata } from "next";
import ReviewsContent from "./ReviewsContent";

export const metadata: Metadata = {
  title: "Our Reviews",
  description:
    "Read what our guests say about their Cretan cooking experience. 5-star reviews from visitors around the world who've joined our authentic cooking classes.",
  openGraph: {
    title: "Our Reviews | Androniki's Cretan House",
    description:
      "Read reviews from guests who've experienced our authentic Cretan cooking classes.",
  },
};

export default function ReviewsPage() {
  return <ReviewsContent />;
}
