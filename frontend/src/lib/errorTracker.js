/**
 * errorTracker.js — Lightweight Frontend Error Telemetry for Lewis
 * Captures React Error Boundaries, unhandled promises, and uncaught exceptions.
 * Deduplicates in-memory to prevent spamming the backend database.
 */

const RECENT_ERRORS = new Map();
const DEDUPE_WINDOW_MS = 30000; // 30 seconds

function getApiBaseUrl() {
  if (typeof window === 'undefined') return '';
  // Check if explicit backend URL is provided in env
  const envUrl = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || '';
  return envUrl.replace(/\/+$/, '');
}

/**
 * Sends error data safely to backend telemetry endpoint.
 */
export async function sendErrorPayload(payload) {
  try {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/errors/log`;
    const body = JSON.stringify(payload);

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (sent) return;
    }

    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch (err) {
    // Fail silently in background to avoid disrupting user experience
    console.debug('Telemetry delivery failed (non-critical):', err);
  }
}

/**
 * Capture and log an error with optional context.
 */
export function captureFrontendError(error, context = {}, level = 'error') {
  try {
    if (!error) return;

    const message = error.message || String(error);
    const errorType = error.name || (typeof error === 'string' ? 'StringError' : 'FrontendRuntimeError');
    const stackTrace = error.stack || null;
    const path = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';

    // In-memory deduplication
    const dedupeKey = `${errorType}:${message}:${path}`;
    const now = Date.now();
    const lastSent = RECENT_ERRORS.get(dedupeKey);
    if (lastSent && now - lastSent < DEDUPE_WINDOW_MS) {
      return;
    }
    RECENT_ERRORS.set(dedupeKey, now);

    // Clean up old entries
    if (RECENT_ERRORS.size > 100) {
      for (const [k, ts] of RECENT_ERRORS.entries()) {
        if (now - ts > DEDUPE_WINDOW_MS * 2) RECENT_ERRORS.delete(k);
      }
    }

    let userIdentifier = null;
    try {
      if (typeof localStorage !== 'undefined') {
        const storedUser = localStorage.getItem('lewis_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          userIdentifier = parsed.email || parsed.id || null;
        }
      }
    } catch {
      // ignore
    }

    sendErrorPayload({
      level,
      source: 'frontend',
      error_type: errorType,
      message,
      stack_trace: stackTrace,
      path,
      user_identifier: userIdentifier,
      context_data: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.debug('Failed to capture frontend error:', e);
  }
}

/**
 * Global Error Tracker Initializer (window.onerror & onunhandledrejection)
 */
export function initErrorTracker() {
  if (typeof window === 'undefined') return;

  // Global uncaught errors
  window.addEventListener('error', (event) => {
    // Ignore benign script loading errors or third-party extension noise
    if (event.filename && (event.filename.includes('chrome-extension://') || event.filename.includes('moz-extension://'))) {
      return;
    }
    const err = event.error || new Error(event.message || 'Script Error');
    captureFrontendError(err, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Global unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const err = reason instanceof Error ? reason : new Error(typeof reason === 'string' ? reason : JSON.stringify(reason));
    captureFrontendError(err, {
      type: 'UnhandledPromiseRejection',
    });
  });
}
