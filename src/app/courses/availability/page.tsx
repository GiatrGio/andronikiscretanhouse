import { Metadata } from "next";
import AvailabilityContent from "./AvailabilityContent";

export const metadata: Metadata = {
  title: "Availability & Details",
  description:
    "Check availability for Cretan cooking classes. Season runs April 20th to October 9th. Maximum 8 guests for mixed groups, up to 12 for private groups.",
  openGraph: {
    title: "Availability & Details | Androniki's Cretan House",
    description:
      "Check availability for authentic Cretan cooking classes in Rethymno.",
  },
};

export default function AvailabilityPage() {
  return <AvailabilityContent />;
}
