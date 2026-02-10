import HeroSection from "@/components/sections/HeroSection";
import FeaturedCards from "@/components/sections/FeaturedCards";
import QuickInfo from "@/components/sections/QuickInfo";

export default function HomePage() {
  return (
    <>
      <HeroSection
        showLogo
        title="Greek Cooking Lessons"
        subtitle="Dining In Rethymno: An Evening Of Cretan Cooking. Experience authentic Cretan cuisine in our family courtyard with traditional wood-fired oven."
        ctaText="Book Your Experience"
        ctaHref="/contact"
        secondaryCtaText="View Courses"
        secondaryCtaHref="/courses"
        backgroundImage="/images/page/homepage_1.jpg"
      />
      <FeaturedCards />
      <QuickInfo />
    </>
  );
}
