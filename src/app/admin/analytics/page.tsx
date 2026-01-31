"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import ChartCard from "@/components/admin/cards/ChartCard";
import { useAdmin } from "@/components/admin/AdminContext";

export default function AnalyticsDashboard() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Analytics Dashboard" },
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
            Analytics Dashboard
          </h1>
          <p className="text-[var(--color-charcoal-light)] mt-2">
            Visual insights and trends from your business data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Monthly Bookings"
            description="Booking trends over the past 12 months"
          >
            <div className="h-64 flex items-end justify-around gap-2 px-4">
              {[65, 78, 82, 71, 88, 95, 105, 98, 112, 108, 115, 122].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-[var(--color-primary)]/60 rounded-t hover:bg-[var(--color-primary)] transition-colors cursor-pointer"
                    style={{ height: `${(height / 122) * 100}%` }}
                    title={`Month ${index + 1}: ${height} bookings`}
                  />
                )
              )}
            </div>
          </ChartCard>

          <ChartCard
            title="Course Popularity"
            description="Most popular cooking courses by enrollment"
          >
            <div className="h-64 flex flex-col justify-around gap-3 px-4">
              {[
                { name: "Traditional Cretan", value: 95 },
                { name: "Mediterranean Mezze", value: 82 },
                { name: "Seafood Specialties", value: 78 },
                { name: "Desserts & Pastries", value: 71 },
                { name: "Wine Pairing", value: 65 },
              ].map((course, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-[var(--color-charcoal)] truncate">
                    {course.name}
                  </div>
                  <div className="flex-1 h-8 bg-[var(--color-cream-dark)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-secondary)] rounded-full transition-all duration-500"
                      style={{ width: `${course.value}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-medium text-[var(--color-charcoal)]">
                    {course.value}%
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Seasonal Trends"
            description="Booking patterns across different seasons"
          >
            <div className="h-64 flex items-end justify-around gap-1 px-4">
              {[45, 52, 58, 65, 78, 88, 95, 102, 98, 85, 72, 58].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t transition-all duration-300 cursor-pointer"
                    style={{
                      height: `${(height / 102) * 100}%`,
                      background: `linear-gradient(to top, var(--color-primary), var(--color-secondary))`,
                      opacity: 0.7 + (height / 102) * 0.3,
                    }}
                    title={`Month ${index + 1}: ${height}%`}
                  />
                )
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </>
  );
}
