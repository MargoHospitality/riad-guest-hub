/**
 * Analytics — PostHog wrapper
 * 
 * Rules:
 * - NEVER send PII (no guest name, email, reservation_id)
 * - distinct_id = guest token (pseudonymous hash)
 * - All events include property_id for per-property breakdown
 * - No-op if VITE_POSTHOG_KEY is not set
 */

import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = 'https://eu.posthog.com'; // EU region (RGPD)

let initialized = false;

export function initAnalytics(): void {
  if (!POSTHOG_KEY || initialized) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    persistence: 'memory',          // No cookies — no consent banner needed
    autocapture: false,             // Manual events only — no accidental PII
    capture_pageview: false,        // Manual page_viewed only
    disable_session_recording: true,
    loaded: () => { initialized = true; },
  });
}

/**
 * Identify the guest session using their token (pseudonymous).
 * Call once after successful token validation.
 */
export function identifySession(token: string, propertyId: string, propertyName: string): void {
  if (!POSTHOG_KEY) return;

  posthog.identify(token, {
    property_id: propertyId,
    property_name: propertyName,
  });
}

// ─── Events ──────────────────────────────────────────────────────────────────

type Props = Record<string, string | number | boolean>;

function capture(event: string, props?: Props): void {
  if (!POSTHOG_KEY) return;
  posthog.capture(event, props);
}

// Session
export const analytics = {

  /** Guest opened the app and token was validated */
  sessionStarted(propertyId: string, propertyName: string) {
    capture('app_session_started', { property_id: propertyId, property_name: propertyName });
  },

  // ── Content ──────────────────────────────────────────────────────────────

  /** Guest viewed a content page from the menu */
  pageViewed(propertyId: string, pageCode: string, lang: string) {
    capture('page_viewed', { property_id: propertyId, page_code: pageCode, lang });
  },

  /** Guest clicked a featured item on the home screen */
  featuredItemClicked(propertyId: string, itemId: string) {
    capture('featured_item_clicked', { property_id: propertyId, item_id: itemId });
  },

  // ── Check-in funnel ───────────────────────────────────────────────────────

  /** Guest started the check-in flow */
  checkinStarted(propertyId: string) {
    capture('checkin_started', { property_id: propertyId });
  },

  /** Guest landed on a check-in step */
  checkinStepViewed(propertyId: string, step: string) {
    capture('checkin_step_viewed', { property_id: propertyId, step });
  },

  /** Guest completed a check-in step (clicked "Continue") */
  checkinStepCompleted(propertyId: string, step: string) {
    capture('checkin_step_completed', { property_id: propertyId, step });
  },

  /** Guest left to Margo Flow to book transport */
  checkinMargoflowLeft(propertyId: string, pax: number) {
    capture('checkin_margoflow_left', { property_id: propertyId, pax });
  },

  /** Guest returned from Margo Flow */
  checkinMargoflowBack(propertyId: string, transportStatus: string) {
    capture('checkin_margoflow_back', { property_id: propertyId, transport_status: transportStatus });
  },

  /** Guest completed the full check-in */
  checkinCompleted(propertyId: string) {
    capture('checkin_completed', { property_id: propertyId });
  },

  // ── Review ────────────────────────────────────────────────────────────────

  /** Guest opened the review form */
  reviewOpened(propertyId: string) {
    capture('review_opened', { property_id: propertyId });
  },

  /** Guest submitted the review form */
  reviewSubmitted(propertyId: string, rating: number) {
    capture('review_submitted', { property_id: propertyId, rating });
  },

  /** Guest clicked the Google Review button (rating >= 4) */
  reviewGoogleClicked(propertyId: string) {
    capture('review_google_clicked', { property_id: propertyId });
  },

  /** mailto fallback triggered (rating <= 3) */
  reviewEmailFallback(propertyId: string) {
    capture('review_email_fallback', { property_id: propertyId });
  },
};
