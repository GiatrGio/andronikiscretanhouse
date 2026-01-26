"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { SITE_NAME, NAVIGATION_LINKS, CONTACT_INFO } from "@/lib/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-xl md:text-2xl font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            {SITE_NAME}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                    : "text-[var(--color-charcoal)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Phone number - Desktop */}
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)] transition-colors"
          >
            <Phone className="w-4 h-4" />
            {CONTACT_INFO.phoneDisplay}
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-[var(--color-charcoal)] hover:bg-[var(--color-cream-dark)] transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-1 border-t border-[var(--color-cream-dark)]">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-base font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                    : "text-[var(--color-charcoal)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="flex items-center gap-2 px-4 py-3 text-base font-medium text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)] transition-colors"
            >
              <Phone className="w-5 h-5" />
              {CONTACT_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
