"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp, ChefHat, LogOut, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
  {
    label: "Analytics Dashboard",
    href: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    label: "Recipes Dashboard",
    href: "/admin/recipes",
    icon: ChefHat,
  },
  {
    label: "Preferences",
    href: "/admin/preferences",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
}

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-[var(--color-cream-dark)] transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Logo/Title */}
          <div className="mb-8 px-2">
            <h2 className="font-heading text-2xl font-bold text-[var(--color-primary)]">
              Admin Panel
            </h2>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-l-4 border-[var(--color-primary)] pl-[8px]"
                      : "text-[var(--color-charcoal)] hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)]"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-[var(--color-cream-dark)] pt-4 mt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-[var(--color-charcoal)] hover:bg-red-50 hover:text-red-600 w-full"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
