import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { TimeWindow, AnalyticsData, TimeSeriesDataPoint, PageViewCount, ReferrerCount, CountryCount } from '@/lib/analytics/types';

function getStartDate(timeWindow: TimeWindow): Date {
  const now = new Date();

  switch (timeWindow) {
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'year':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    case 'all':
    default:
      return new Date(2020, 0, 1); // Far enough in the past
  }
}

function formatPeriod(date: Date, timeWindow: TimeWindow): string {
  if (timeWindow === 'week') {
    // Day format: "Mon", "Tue", etc.
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else if (timeWindow === 'year') {
    // Month format: "Jan 2024"
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } else {
    // Year format: "2024"
    return date.getFullYear().toString();
  }
}

function getDateKey(date: Date, timeWindow: TimeWindow): string {
  if (timeWindow === 'week') {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } else if (timeWindow === 'year') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
  } else {
    return date.getFullYear().toString(); // YYYY
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const timeWindow = (searchParams.get('timeWindow') as TimeWindow) || 'week';
    const startDate = getStartDate(timeWindow);

    // Fetch all page views within the time window
    const { data: pageViews, error: fetchError } = await supabase
      .from('analytics_page_views')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Failed to fetch analytics:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }

    const views = pageViews || [];

    // Calculate time series data
    const timeSeriesMap = new Map<string, { views: number; sessions: Set<string>; date: Date }>();

    // Initialize periods
    const now = new Date();
    if (timeWindow === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = getDateKey(date, timeWindow);
        timeSeriesMap.set(key, { views: 0, sessions: new Set(), date });
      }
    } else if (timeWindow === 'year') {
      // For year, show monthly data
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = getDateKey(date, timeWindow);
        timeSeriesMap.set(key, { views: 0, sessions: new Set(), date });
      }
    } else {
      // For all time, show yearly data
      const currentYear = now.getFullYear();
      const startYear = startDate.getFullYear();
      for (let year = startYear; year <= currentYear; year++) {
        const date = new Date(year, 0, 1);
        const key = getDateKey(date, timeWindow);
        timeSeriesMap.set(key, { views: 0, sessions: new Set(), date });
      }
    }

    // Aggregate page views
    const pageViewCounts = new Map<string, { path: string; title: string; views: number }>();
    const referrerCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    const allSessions = new Set<string>();

    for (const view of views) {
      const viewDate = new Date(view.created_at);
      const key = getDateKey(viewDate, timeWindow);

      // Time series
      const existing = timeSeriesMap.get(key);
      if (existing) {
        existing.views++;
        existing.sessions.add(view.session_id);
      }

      // Track all sessions
      allSessions.add(view.session_id);

      // Page view counts
      const pageKey = view.page_path;
      const pageData = pageViewCounts.get(pageKey) || { path: view.page_path, title: view.page_title, views: 0 };
      pageData.views++;
      pageViewCounts.set(pageKey, pageData);

      // Referrer counts
      const referrer = view.referrer_domain || 'Direct';
      referrerCounts.set(referrer, (referrerCounts.get(referrer) || 0) + 1);

      // Country counts
      if (view.country) {
        countryCounts.set(view.country, (countryCounts.get(view.country) || 0) + 1);
      }
    }

    // Convert time series to array
    const timeSeries: TimeSeriesDataPoint[] = Array.from(timeSeriesMap.entries())
      .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
      .map(([, data]) => ({
        period: formatPeriod(data.date, timeWindow),
        views: data.views,
        visitors: data.sessions.size,
      }));

    // Convert and sort page views
    const mostViewed: PageViewCount[] = Array.from(pageViewCounts.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
      .map(({ path, title, views }) => ({ page_path: path, page_title: title, views }));

    // Convert and sort referrers
    const referrers: ReferrerCount[] = Array.from(referrerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([domain, views]) => ({ referrer_domain: domain, views }));

    // Convert and sort countries
    const countries: CountryCount[] = Array.from(countryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([country, views]) => ({ country, views }));

    const analyticsData: AnalyticsData = {
      timeSeries,
      totalViews: views.length,
      uniqueVisitors: allSessions.size,
      mostViewed,
      referrers,
      countries,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
