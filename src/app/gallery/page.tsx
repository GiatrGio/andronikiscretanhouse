import { Metadata } from "next";
import GalleryContent from "./GalleryContent";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Browse photos from our Cretan cooking classes. See our courtyard, wood-fired oven, delicious dishes, and happy guests enjoying authentic Greek cuisine.",
  openGraph: {
    title: "Photo Gallery | Androniki's Cretan House",
    description:
      "Browse photos from our authentic Cretan cooking classes.",
  },
};

export default function GalleryPage() {
  return <GalleryContent />;
}
