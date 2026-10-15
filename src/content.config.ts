import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";
import { CATEGORY_LABELS } from "./lib/categories";


/**
 * Decap CMS stores single-file ("files" collection) content as one plain JSON
 * object, while Astro's file() loader expects an array of entries with ids.
 * This parser bridges the two.
 */
const singleton = (id: string) => (text: string) => [{ id, ...JSON.parse(text) }];

const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(CATEGORY_LABELS),
    short_description: z.string(),
    icon: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
    pricing_type: z.enum(["Free", "Freemium", "Paid"]),
    price: z.string().optional(),
    features: z.array(z.string()).default([]),
    version: z.string().optional(),
    compatibility: z.string().optional(),
    links: z
      .object({
        store_url: z.string().optional(),
        demo_url: z.string().optional(),
        docs_url: z.string().optional(),
        buy_url: z.string().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    status: z.enum(["Available", "Coming Soon"]).default("Available"),
  }),
});

const solutions = defineCollection({
  loader: glob({ base: "./src/content/solutions", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    icon: z.string().optional(),
    short_description: z.string(),
    benefits: z.array(z.string()).default([]),
    process_steps: z
      .array(z.object({ title: z.string(), description: z.string() }))
      .default([]),
    cta_text: z.string().default("Talk to us about this"),
    order: z.number().default(99),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    solution: z.string(), // solution slug this project appears under
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    thumbnail: z.string().optional(),
    platform: z.string().optional(),
    year: z.string().optional(),
    order: z.number().default(99),
  }),
});

const testimonials = defineCollection({
  loader: glob({ base: "./src/content/testimonials", pattern: "**/*.md" }),
  schema: z.object({
    name: z.string(),
    company: z.string(),
    quote: z.string(),
    avatar: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
  }),
});

const home = defineCollection({
  loader: file("./src/content/pages/home.json", { parser: singleton("home") }),
  schema: z.object({
    hero_title: z.string(),
    hero_subtitle: z.string(),
    hero_primary_cta: z.object({ text: z.string(), url: z.string() }),
    hero_secondary_cta: z.object({ text: z.string(), url: z.string() }),
    stats: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .default([]),
    show_stats: z.boolean().default(false),
    show_testimonials: z.boolean().default(false),
    show_featured: z.boolean().default(true),
    show_solutions: z.boolean().default(true),
  }),
});

const about = defineCollection({
  loader: file("./src/content/pages/about.json", { parser: singleton("about") }),
  schema: z.object({
    intro: z.string(),
    story: z.string(),
    mission: z.string(),
    values: z.array(z.object({ title: z.string(), description: z.string() })),
    team: z
      .array(z.object({ name: z.string(), role: z.string(), photo: z.string().optional() }))
      .default([]),
  }),
});

const contact = defineCollection({
  loader: file("./src/content/pages/contact.json", { parser: singleton("contact") }),
  schema: z.object({
    email: z.string(),
    enquiry_email: z.string().optional(),
    whatsapp: z.string().optional(),
    address: z.string().optional(),
    working_hours: z.string().optional(),
    form_action_url: z.string().optional(),
    turnstile_site_key: z.string().optional(),
    emailjs: z
      .object({
        public_key: z.string().default(""),
        service_id: z.string().default(""),
        template_notify: z.string().default(""),
        template_autoreply: z.string().default(""),
      })
      .optional(),
  }),
});

const settings = defineCollection({
  loader: file("./src/content/settings/site.json", { parser: singleton("site") }),
  schema: z.object({
    site_title: z.string(),
    tagline: z.string(),
    logo: z.string(),
    social_links: z
      .array(z.object({ label: z.string(), url: z.string() }))
      .default([]),
    footer_text: z.string(),
    seo: z.object({
      meta_description: z.string(),
      og_image: z.string(),
    }),
    // Cloudflare Web Analytics site token; empty = no beacon rendered.
    cloudflare_analytics_token: z.string().default(""),
    // Third-party integration IDs. All public by design (they ship in the
    // HTML of every site using them); each renders only when non-empty.
    google_site_verification: z.string().default(""),
    gtm_id: z.string().default(""),
    ga4_id: z.string().default(""),
    meta_pixel_id: z.string().default(""),
  }),
});

export const collections = {
  products,
  solutions,
  projects,
  testimonials,
  home,
  about,
  contact,
  settings,
};
