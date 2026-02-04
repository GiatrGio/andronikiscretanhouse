import { getCountryFromTimezone } from './countries';
import type { TrackPageViewInput } from './types';

const SESSION_ID_KEY = 'analytics_session_id';

/**
 * Generate a random session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create a session ID using sessionStorage
 * This resets when the browser is closed, providing privacy
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return generateSessionId();
  }

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Extract domain from referrer URL
 * Returns null for direct visits or same-origin referrers
 */
export function getReferrerDomain(): string | null {
  if (typeof window === 'undefined' || !document.referrer) {
    return null;
  }

  try {
    const referrerUrl = new URL(document.referrer);
    const currentHost = window.location.host;

    // Return null for same-origin referrers (internal navigation)
    if (referrerUrl.host === currentHost) {
      return null;
    }

    // Return just the hostname (domain)
    return referrerUrl.hostname;
  } catch {
    return null;
  }
}

/**
 * Get country from browser timezone
 */
export function getCountry(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return getCountryFromTimezone();
}

/**
 * Track a page view by sending data to the API
 */
export async function trackPageView(pagePath: string, pageTitle: string): Promise<void> {
  try {
    const data: TrackPageViewInput = {
      page_path: pagePath,
      page_title: pageTitle,
      session_id: getSessionId(),
      referrer_domain: getReferrerDomain(),
      country: getCountry(),
    };

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    // Silently fail - analytics should never break the user experience
    console.error('Failed to track page view:', error);
  }
}
