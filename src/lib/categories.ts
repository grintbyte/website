/**
 * Product categories. The `label` values must stay in sync with two places:
 * the `category` enum in src/content.config.ts and the select options in
 * public/admin/config.yml. To add a category, update all three (see README).
 */
export interface Category {
  label: string;
  slug: string;
  blurb: string;
  tagline: string; // category-page hero headline
  icon: string; // key into the Icon component's glyph map
}

export const CATEGORIES: Category[] = [
  {
    label: "WordPress Plugins",
    slug: "wordpress-plugins",
    tagline: "Extend WordPress, keep it fast",
    blurb: "Plugins that extend WordPress sites without the bloat.",
    icon: "plug",
  },
  {
    label: "Shopify Apps",
    slug: "shopify-apps",
    tagline: "Shopify apps that pull their weight",
    blurb: "Apps that add storefront and back-office power to Shopify.",
    icon: "bag",
  },
  {
    label: "AI Tools",
    slug: "ai-tools",
    tagline: "Language models, put to work",
    blurb: "Practical tools that put language models to work.",
    icon: "nodes",
  },
  {
    label: "Odoo Apps",
    slug: "odoo-apps",
    tagline: "Bend Odoo to the way you operate",
    blurb: "Modules that bend Odoo ERP to the way you operate.",
    icon: "boxes",
  },
  {
    label: "Dolibarr Modules",
    slug: "dolibarr-modules",
    tagline: "Make Dolibarr do more",
    blurb: "Extensions for the Dolibarr ERP & CRM suite.",
    icon: "layers",
  },
  {
    label: "Chrome Extensions",
    slug: "chrome-extensions",
    tagline: "Shave minutes off every browser day",
    blurb: "Browser extensions that shave minutes off daily work.",
    icon: "window",
  },
  {
    label: "Software Platforms",
    slug: "software-platforms",
    tagline: "Products we build and run end to end",
    blurb: "Standalone products we build and run end to end.",
    icon: "stack",
  },
  // The home orbit visual shows only the first 7 categories (platform
  // integrations); the ones below list everywhere else.
  {
    label: "ERPNext Apps",
    slug: "erpnext-apps",
    tagline: "Make ERPNext fit your operation",
    blurb: "Apps that extend the ERPNext open source ERP.",
    icon: "cube",
  },
  {
    label: "Business Playbooks",
    slug: "business-playbooks",
    tagline: "Proven ways of working, written down",
    blurb: "Ready-to-use playbooks that document how a business runs.",
    icon: "book",
  },
  {
    label: "Operational SOP Kits",
    slug: "operational-sop-kits",
    tagline: "Standard operating procedures, ready to adopt",
    blurb: "SOP templates and kits that put daily operations on paper.",
    icon: "clipboard",
  },
  {
    label: "Professional Kits",
    slug: "professional-kits",
    tagline: "Tools and templates for professional work",
    blurb: "Document and template kits for professionals and teams.",
    icon: "briefcase",
  },
];

export const CATEGORY_LABELS = CATEGORIES.map((c) => c.label) as [string, ...string[]];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((c) => c.label === label);
}

/** Canonical product URL: nested under its category, matching the breadcrumb.
 * A custom `permalink` (editable in the CMS) overrides the filename. */
export function productPath(product: { id: string; data: { category: string; permalink?: string } }): string {
  return `/products/${categoryByLabel(product.data.category)!.slug}/${product.data.permalink || product.id}`;
}
