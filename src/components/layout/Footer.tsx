import Link from "next/link";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import { SITE_NAME, NAVIGATION_LINKS, CONTACT_INFO } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-charcoal)] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: About */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-[var(--color-secondary-light)]">
              {SITE_NAME}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Experience authentic Cretan cuisine in the heart of Rethymno.
              Join us for traditional Greek cooking lessons in our beautiful
              courtyard, where family recipes come to life in our wood-fired
              oven.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-[var(--color-secondary-light)]">
              Quick Links
            </h3>
            <nav className="grid grid-cols-2 gap-2">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white hover:underline transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-[var(--color-secondary-light)]">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={CONTACT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--color-secondary-light)] group-hover:text-[var(--color-secondary)]" />
                  <span>{CONTACT_INFO.address}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <Phone className="w-5 h-5 flex-shrink-0 text-[var(--color-secondary-light)] group-hover:text-[var(--color-secondary)]" />
                  <span>{CONTACT_INFO.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <Mail className="w-5 h-5 flex-shrink-0 text-[var(--color-secondary-light)] group-hover:text-[var(--color-secondary)]" />
                  <span className="break-all">{CONTACT_INFO.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5 flex-shrink-0 text-[var(--color-secondary-light)]" />
                <span>Season: {CONTACT_INFO.season}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} {SITE_NAME}. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Traditional Cretan Cooking Experience
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
