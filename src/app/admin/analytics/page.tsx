"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ChartCard from "@/components/admin/cards/ChartCard";
import { useAdmin } from "@/components/admin/AdminContext";
import type { TimeWindow, AnalyticsData } from "@/lib/analytics/types";

const TIME_WINDOW_OPTIONS: { value: TimeWindow; label: string }[] = [
  { value: "week", label: "Last Week" },
  { value: "year", label: "Last Year" },
  { value: "all", label: "All Time" },
];

export default function AnalyticsDashboard() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("week");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Analytics Dashboard" },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/analytics/data?timeWindow=${timeWindow}`);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const analyticsData: AnalyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeWindow]);

  const maxTimeSeriesValue = data?.timeSeries
    ? Math.max(...data.timeSeries.map((d) => Math.max(d.views, d.visitors)), 1)
    : 1;

  const maxMostViewedValue = data?.mostViewed
    ? Math.max(...data.mostViewed.map((d) => d.views), 1)
    : 1;

  const maxReferrerValue = data?.referrers
    ? Math.max(...data.referrers.map((d) => d.views), 1)
    : 1;

  // Shorten period labels for mobile (e.g., "Jan 2024" -> "Jan")
  const getShortenedPeriod = (period: string) => {
    if (timeWindow === "year") {
      // Remove the year part for mobile
      return period.split(" ")[0];
    }
    return period;
  };

  return (
    <>
      <AdminHeader
        breadcrumbItems={breadcrumbItems}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--color-charcoal)]">
              Analytics Dashboard
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-charcoal-light)] mt-1 sm:mt-2">
              Privacy-first insights from your website traffic
            </p>
          </div>

          {/* Time Window Selector */}
          <div className="flex gap-1 bg-[var(--color-cream-dark)] rounded-lg p-1 w-full sm:w-auto">
            {TIME_WINDOW_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeWindow(option.value)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  timeWindow === option.value
                    ? "bg-white text-[var(--color-charcoal)] shadow-sm"
                    : "text-[var(--color-charcoal-light)] hover:text-[var(--color-charcoal)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-6">
            {/* Views & Visitors Chart */}
            <ChartCard
              title="Views & Visitors"
              description={`Page views and unique visitors over the ${timeWindow === "week" ? "past week" : timeWindow === "year" ? "past year" : "entire period"}`}
            >
              <div className="h-48 sm:h-64 flex items-end gap-0.5 sm:gap-1 px-1 sm:px-4">
                {data.timeSeries.map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 min-w-0 flex flex-col items-center gap-0.5 sm:gap-1"
                  >
                    <div className="w-full flex gap-0.5 items-end justify-center h-36 sm:h-48">
                      {/* Views bar */}
                      <div
                        className="w-1/2 bg-[var(--color-primary)]/60 rounded-t transition-all duration-300 cursor-pointer hover:bg-[var(--color-primary)]"
                        style={{
                          height: `${(point.views / maxTimeSeriesValue) * 100}%`,
                          minHeight: point.views > 0 ? "4px" : "0",
                        }}
                        title={`${point.period} - Views: ${point.views}`}
                      />
                      {/* Visitors bar */}
                      <div
                        className="w-1/2 bg-[var(--color-secondary)] rounded-t transition-all duration-300 cursor-pointer hover:bg-[var(--color-secondary)]/80"
                        style={{
                          height: `${(point.visitors / maxTimeSeriesValue) * 100}%`,
                          minHeight: point.visitors > 0 ? "4px" : "0",
                        }}
                        title={`${point.period} - Visitors: ${point.visitors}`}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-[var(--color-charcoal-light)] truncate w-full text-center">
                      <span className="sm:hidden">{getShortenedPeriod(point.period)}</span>
                      <span className="hidden sm:inline">{point.period}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend and Summary */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-[var(--color-cream-dark)] pt-4">
                <div className="flex gap-4 sm:gap-6 justify-center sm:justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[var(--color-primary)]/60" />
                    <span className="text-sm text-[var(--color-charcoal-light)]">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[var(--color-secondary)]" />
                    <span className="text-sm text-[var(--color-charcoal-light)]">Visitors</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-6 sm:flex">
                  <div className="text-center sm:text-right">
                    <div className="text-lg sm:text-2xl font-bold text-[var(--color-charcoal)]">
                      {data.totalViews.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--color-charcoal-light)]">Total Views</div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-lg sm:text-2xl font-bold text-[var(--color-charcoal)]">
                      {data.uniqueVisitors.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--color-charcoal-light)]">Visitors</div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-lg sm:text-2xl font-bold text-[var(--color-charcoal)]">
                      {data.uniqueVisitors > 0
                        ? (data.totalViews / data.uniqueVisitors).toFixed(1)
                        : "0"}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--color-charcoal-light)]">Views/Visitor</div>
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* Most Viewed & Referrers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Viewed Pages */}
              <ChartCard
                title="Most Viewed Pages"
                description="Top 10 pages by view count"
              >
                <div className="space-y-3">
                  {data.mostViewed.length === 0 ? (
                    <p className="text-[var(--color-charcoal-light)] text-center py-8">
                      No page views recorded yet
                    </p>
                  ) : (
                    data.mostViewed.map((page, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 text-sm font-medium text-[var(--color-charcoal-light)]">
                          {index + 1}.
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[var(--color-charcoal)] truncate">
                            {page.page_title || page.page_path}
                          </div>
                          <div className="h-2 bg-[var(--color-cream-dark)] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                              style={{
                                width: `${(page.views / maxMostViewedValue) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-12 text-sm font-medium text-[var(--color-charcoal)] text-right">
                          {page.views}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ChartCard>

              {/* Referrers */}
              <ChartCard
                title="Traffic Sources"
                description="Where your visitors come from"
              >
                <div className="space-y-3">
                  {data.referrers.length === 0 ? (
                    <p className="text-[var(--color-charcoal-light)] text-center py-8">
                      No referrer data recorded yet
                    </p>
                  ) : (
                    data.referrers.map((referrer, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 text-sm font-medium text-[var(--color-charcoal-light)]">
                          {index + 1}.
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[var(--color-charcoal)] truncate">
                            {referrer.referrer_domain}
                          </div>
                          <div className="h-2 bg-[var(--color-cream-dark)] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-[var(--color-secondary)] rounded-full transition-all duration-500"
                              style={{
                                width: `${(referrer.views / maxReferrerValue) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-12 text-sm font-medium text-[var(--color-charcoal)] text-right">
                          {referrer.views}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ChartCard>
            </div>

            {/* Countries */}
            <ChartCard
              title="Visitor Countries"
              description="Geographic distribution of your visitors (based on timezone)"
            >
              {data.countries.length === 0 ? (
                <p className="text-[var(--color-charcoal-light)] text-center py-8">
                  No country data recorded yet
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {data.countries.map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[var(--color-cream)] rounded-lg"
                    >
                      <span className="text-sm font-medium text-[var(--color-charcoal)]">
                        {country.country}
                      </span>
                      <span className="text-sm font-bold text-[var(--color-primary)]">
                        {country.views}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ChartCard>
          </div>
        )}
      </div>
    </>
  );
}
