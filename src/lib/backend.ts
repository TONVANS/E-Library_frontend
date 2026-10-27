// Build fails if a Client Component imports this file, so the backend URL can never reach the browser bundle
import 'server-only';

// The real backend URL, read only from the server-side API_URL env var (never NEXT_PUBLIC_*, which
// Next.js inlines into client JavaScript). Browser code goes through API_BASE_URL (src/lib/api-config.ts).
// Read lazily so `next build` works without it; only the API proxy and document metadata need it at runtime.
export function getBackendUrl() {
  const url = process.env.API_URL;
  if (!url) {
    throw new Error('API_URL is not set. Configure it in .env or the container environment.');
  }
  return url.replace(/\/$/, '');
}
