import type { APIRoute } from "astro";

// Generated at build time so the sitemap URL follows SITE_URL/BASE_PATH
// instead of being hardcoded.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(
    `${import.meta.env.BASE_URL.replace(/\/$/, "")}/sitemap-index.xml`,
    site,
  );
  return new Response(
    ["User-agent: *", "Allow: /", "Disallow: /admin/", "", `Sitemap: ${sitemap}`, ""].join("\n"),
    { headers: { "Content-Type": "text/plain" } },
  );
};
