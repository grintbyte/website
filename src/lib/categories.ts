/**
 * Product categories. The `label` values must stay in sync with two places:
 * the `category` enum in src/content.config.ts and the select options in
 * public/admin/config.yml. To add a category, update all three (see README).
 */
export interface Category {
  label: string;
  slug: string;
  blurb: string;
  icon: string; // key into the Icon component's glyph map
}

export const CATEGORIES: Category[] = [
  {
    label: "WordPress Plugins",
    slug: "wordpress-plugins",
    blurb: "Plugins that extend WordPress sites without the bloat.",
    icon: "plug",
  },
  {
    label: "Shopify Apps",
    slug: "shopify-apps",
    blurb: "Apps that add storefront and back-office power to Shopify.",
    icon: "bag",
  },
  {
    label: "AI Tools",
    slug: "ai-tools",
    blurb: "Practical tools that put language models to work.",
    icon: "nodes",
  },
  {
    label: "Odoo Apps",
    slug: "odoo-apps",
    blurb: "Modules that bend Odoo ERP to the way you operate.",
    icon: "boxes",
  },
  {
    label: "Dolibarr Modules",
    slug: "dolibarr-modules",
    blurb: "Extensions for the Dolibarr ERP & CRM suite.",
    icon: "layers",
  },
  {
    label: "Chrome Extensions",
    slug: "chrome-extensions",
    blurb: "Browser extensions that shave minutes off daily work.",
    icon: "window",
  },
  {
    label: "Software Platforms",
    slug: "software-platforms",
    blurb: "Standalone products we build and run end to end.",
    icon: "stack",
  },
];

export const CATEGORY_LABELS = CATEGORIES.map((c) => c.label) as [string, ...string[]];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((c) => c.label === label);
}
