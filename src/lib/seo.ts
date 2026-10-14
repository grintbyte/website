import { withBase } from "./paths";

/**
 * BreadcrumbList JSON-LD. Pass [name, path] pairs in order; the last item
 * (the current page) may use a null path, which Google allows.
 */
export function breadcrumbLd(site: URL | undefined, items: [string, string | null][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      ...(path ? { item: new URL(withBase(path), site).toString() } : {}),
    })),
  };
}
