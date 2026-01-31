"use client";

import { Menu, X } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface AdminHeaderProps {
  breadcrumbItems: { label: string; href?: string }[];
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function AdminHeader({
  breadcrumbItems,
  isSidebarOpen,
  onToggleSidebar,
}: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-[var(--color-cream-dark)] sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-[var(--color-charcoal)] hover:bg-[var(--color-cream)] transition-colors"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </div>
    </header>
  );
}
