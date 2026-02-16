import { CONTACT_INFO, SITE_NAME } from "@/lib/constants";

export function LocalBusinessJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://andronikiscretanhouse.com",
    name: SITE_NAME,
    alternateName: "Greek Cooking Lessons Rethymno",
    description:
      "Authentic Cretan cooking classes in Rethymno, Crete. Learn traditional Greek recipes in a beautiful courtyard with wood-fired oven.",
    url: "https://andronikiscretanhouse.com",
    telephone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Loutra",
      addressLocality: "Rethymno",
      addressRegion: "Crete",
      addressCountry: "GR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 35.3667,
      longitude: 24.4833,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "17:30",
      closes: "22:00",
    },
    priceRange: "$$",
    servesCuisine: ["Greek", "Cretan", "Mediterranean"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cooking Classes",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Traditional Cretan Cooking Class",
            description:
              "4-hour hands-on cooking experience including meal and wine",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: 7,
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function CookingClassJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Traditional Cretan Cooking Class",
    description:
      "Learn authentic Cretan cooking techniques and recipes in a traditional courtyard setting with wood-fired oven.",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: "https://andronikiscretanhouse.com",
    },
    courseMode: "onsite",
    courseWorkload: "PT4H",
    educationalLevel: "beginner",
    teaches: [
      "Traditional Cretan recipes",
      "Wood oven cooking",
      "Fresh ingredient preparation",
      "Cretan culinary traditions",
    ],
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: SITE_NAME,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rethymno",
          addressRegion: "Crete",
          addressCountry: "Greece",
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
