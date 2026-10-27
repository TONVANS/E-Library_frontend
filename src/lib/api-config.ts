// Must match `basePath` in next.config.ts
export const BASE_PATH = '/elibrary';

// Browser calls go through the same-origin route handler at src/app/api/[...path]/route.ts,
// which forwards them to the backend (API_URL). This hides the backend URL and avoids CORS.
export const API_BASE_URL = `${BASE_PATH}/api`;

export const AUTH_COOKIE = 'nuol_token';

// Build a URL for a backend-served file (covers, PDFs under /uploads)
export function getFileUrl(path?: string | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const normalizedPath = path.replace(/\\/g, '/');
  return `${API_BASE_URL}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}
