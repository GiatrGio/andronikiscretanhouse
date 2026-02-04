'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics/tracking';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip tracking for admin pages
    if (pathname.startsWith('/admin')) {
      return;
    }

    // Avoid tracking the same path twice (prevents double tracking on hydration)
    if (lastTrackedPath.current === pathname) {
      return;
    }

    lastTrackedPath.current = pathname;

    // Use document.title, fallback to pathname
    const pageTitle = document.title || pathname;

    trackPageView(pathname, pageTitle);
  }, [pathname]);

  return null;
}
