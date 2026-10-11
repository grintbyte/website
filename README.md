# GrintByte — Digital Products Studio

Company profile + product catalog. Static site built with **Astro**,
**Tailwind CSS** and **Decap CMS**, deployed to **GitHub Pages**.

> **Sample content notice**: the products, solutions and testimonials in
> `src/content/` are placeholder seed content demonstrating the structure.
> The testimonial entries are explicitly labeled as samples, and the
> testimonials and statistics sections on the home page are **switched off**
> (`show_testimonials` / `show_stats` in Pages → Home). Replace the samples
> with real data before turning those sections on. The contact email
> (`hello@example.com`) is also a placeholder.

## Install & run locally

Requires Node.js ≥ 22.12.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Editing content

All content lives in `src/content/` and is validated by the Zod schemas in
`src/content.config.ts`.

### Locally (no login required)

```bash
npm run cms        # terminal 1: starts decap-server (local backend)
npm run dev        # terminal 2
```

Open <http://localhost:4321/admin/>. Because `local_backend: true` is set in
`public/admin/config.yml`, the CMS writes straight to your working tree —
commit the changes like any other edit.

### In production (`/admin` on the live site)

Decap's GitHub backend needs an OAuth handshake, and GitHub Pages has no
server to perform it, so you need **one** of these:

**Option A — Sveltia CMS (simplest, no proxy).**
Sveltia is a drop-in replacement that reads the same `config.yml` and can sign
in with a GitHub personal access token — no OAuth app, no proxy. Swap the
script tag in `public/admin/index.html` (the replacement tag is in a comment
there) and remove the `base_url` line from `config.yml`.

**Option B — Decap + an OAuth proxy (free Cloudflare Worker).**

1. Create a **GitHub OAuth App** (GitHub → Settings → Developer settings →
   OAuth Apps → New):
   - Homepage URL: your site URL.
   - Authorization callback URL: `https://<your-worker>.workers.dev/callback`.
   - Note the Client ID and generate a Client Secret.
2. Deploy an OAuth proxy Worker. Any maintained Decap OAuth provider works,
   e.g. [`decap-proxy`](https://github.com/sterlingwes/decap-proxy): clone it,
   `wrangler deploy`, then set `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET` as
   Worker secrets.
3. In `public/admin/config.yml`, set:
   - `repo: <owner>/<repo>`
   - `base_url: https://<your-worker>.workers.dev`
4. Visit `https://<your-site>/admin/` and log in with GitHub.

`publish_mode: editorial_workflow` is enabled: CMS edits open pull requests
with a review step. Delete that line in `config.yml` to publish directly to
`main`.

### Media

Uploads go to `public/images/uploads/` (`media_folder`), referenced in content
as `/images/uploads/...` (`public_folder`). Templates wrap every image path in
`withBase()`, so uploads keep working under a repo base path.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds with `withastro/action` and deploys with
`actions/deploy-pages` on every push to `main`. One-time setup:

1. Repo → Settings → Pages → Source: **GitHub Actions**.
2. Edit the two values at the top of the workflow:

| Scenario | `SITE_URL` | `BASE_PATH` |
|---|---|---|
| Project page (`https://owner.github.io/repo`) | `https://owner.github.io` | `/repo` |
| Custom domain / user page | `https://yourdomain.com` | `/` |

For a custom domain, also rename `public/CNAME.example` to `public/CNAME`
containing only your bare domain (GitHub reads the first line literally, which
is why the shipped file is an `.example` rather than a commented CNAME), and
configure the domain under Settings → Pages.

### Why links survive a base-path change

`astro.config.mjs` reads `SITE_URL`/`BASE_PATH` from the environment, and every
internal link and image path goes through `withBase()`
(`src/lib/paths.ts`), which prefixes `import.meta.env.BASE_URL`. Change the two
workflow variables and redeploy — nothing else to touch.

## Adding a new product category

Three places must agree (each file says so in a comment):

1. `src/lib/categories.ts` — add `{ label, slug, blurb, icon }`.
2. `src/content.config.ts` — nothing to do; the enum derives from step 1.
3. `public/admin/config.yml` — add the same label to the `category` select
   options in the products collection.

The category page (`/products/<slug>`), nav dropdown, footer and filters all
generate from `categories.ts`. Product filenames must never equal a category
slug (one dynamic route serves both URL shapes).

## Contact form

The site is static, so the form posts to a third-party endpoint
(Web3Forms / Formspree). Set **Pages → Contact → Form endpoint URL** in the
CMS (e.g. `https://api.web3forms.com/submit` — Web3Forms also needs a hidden
`access_key` field; add it in `src/pages/contact.astro` when you pick a
provider). While the URL is empty, the page shows an honest "form not
configured" notice with an email link instead of a dead form.

## Brand assets

A **white wordmark** for dark backgrounds does not exist in the repo (both SVGs
embed raster images, so CSS recoloring is impossible). The footer is
deliberately light and dark bands use plain text. When you have a white logo
file, drop it in `public/images/brand/` and use it in
`src/components/CtaBand.astro` / `Footer.astro`.
