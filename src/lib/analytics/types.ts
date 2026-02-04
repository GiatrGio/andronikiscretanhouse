export interface PageView {
  id: string;
  page_path: string;
  page_title: string;
  session_id: string;
  referrer_domain: string | null;
  country: string | null;
  created_at: string;
}

export interface TrackPageViewInput {
  page_path: string;
  page_title: string;
  session_id: string;
  referrer_domain: string | null;
  country: string | null;
}

export type TimeWindow = 'week' | 'year' | 'all';

export interface TimeSeriesDataPoint {
  period: string;
  views: number;
  visitors: number;
}

export interface PageViewCount {
  page_path: string;
  page_title: string;
  views: number;
}

export interface ReferrerCount {
  referrer_domain: string;
  views: number;
}

export interface CountryCount {
  country: string;
  views: number;
}

export interface AnalyticsData {
  timeSeries: TimeSeriesDataPoint[];
  totalViews: number;
  uniqueVisitors: number;
  mostViewed: PageViewCount[];
  referrers: ReferrerCount[];
  countries: CountryCount[];
}
