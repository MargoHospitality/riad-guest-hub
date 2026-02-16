/**
 * Navigation helpers to preserve token in URLs
 */

/**
 * Build a path with optional token preservation
 * @param path - Base path (e.g., "/", "/guide")
 * @param token - Optional token to append
 * @returns Path with ?token=xxx if token exists
 */
export function withToken(path: string, token: string | null): string {
  if (!token) return path;
  
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}token=${token}`;
}
