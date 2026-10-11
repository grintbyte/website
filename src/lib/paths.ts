/**
 * Prefix an internal path with the configured base path so links and image
 * URLs survive a switch between a custom domain (base "/") and a GitHub
 * project page (base "/<repo>"). Use this for EVERY internal href and
 * every /images/... path.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path}` || "/";
}
