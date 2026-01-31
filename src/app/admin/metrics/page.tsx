"use client";

import { Users, BookOpen, Euro, Star } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/cards/StatCard";
import { useAdmin } from "@/components/admin/AdminContext";

export default function MetricsDashboard() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Metrics Dashboard" },
  ];

  return (
    <>
      <AdminHeader
        breadcrumbItems={breadcrumbItems}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-[var(--color-charcoal)]">
            Metrics Dashboard
          </h1>
          <p className="text-[var(--color-charcoal-light)] mt-2">
            Overview of key business metrics and performance indicators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Bookings"
            value={87}
            icon={Users}
            trend="up"
            trendValue="↑ 12%"
          />
          <StatCard
            title="Active Courses"
            value={12}
            icon={BookOpen}
            trend="up"
            trendValue="↑ 2"
          />
          <StatCard
            title="Monthly Revenue"
            value="€4,250"
            icon={Euro}
            trend="up"
            trendValue="↑ 8%"
          />
          <StatCard
            title="Customer Rating"
            value="4.8/5"
            icon={Star}
            trend="neutral"
            trendValue="→ 0%"
          />
        </div>
      </div>
    </>
  );
}
