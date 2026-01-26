import { Home, Search } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--color-cream)] px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-[var(--color-primary)]" />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-[var(--color-charcoal)] mb-4">
          404
        </h1>
        <h2 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-charcoal)] mb-4">
          Page Not Found
        </h2>
        <p className="text-[var(--color-charcoal-light)] mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button href="/contact" variant="outline">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
