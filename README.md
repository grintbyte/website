# GrintByte — Digital Products Studio

Company profile + product catalog. Static site built with **Astro**,
**Tailwind CSS** and **Decap CMS**, deployed to **GitHub Pages**.

> **Sample content notice**: the products, solutions, projects and
> testimonials in `src/content/` are placeholder seed content demonstrating
> the structure. The testimonial entries are explicitly labeled as samples,
> and the testimonials and statistics sections on the home page are
> **switched off** (`show_testimonials` / `show_stats` in Pages → Home).
> The project entries under `src/content/projects/` describe generic
> engagement shapes, not named client work: replace them with real case
> studies (and square thumbnails) via CMS → Projects before launch.

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
server to perform it, so a small OAuth proxy Worker lives in `oauth/` and is
deployed to Cloudflare as
`https://grintbyte-decap-oauth.grintopsglobal.workers.dev`
(`config.yml` points its `base_url` there).

Setup (done once; repeat only if the Worker or OAuth App is recreated):

1. Create a **GitHub OAuth App** (GitHub → Settings → Developer settings →
   OAuth Apps → New):
   - Homepage URL: `https://grintbyte.com`
   - Authorization callback URL:
     `https://grintbyte-decap-oauth.grintopsglobal.workers.dev/callback`
   - Note the Client ID and generate a Client Secret.
2. Deploy and configure the Worker (needs `wrangler login`):
   ```sh
   cd oauth
   npx wrangler deploy
   npx wrangler secret put GITHUB_CLIENT_ID      # paste the Client ID
   npx wrangler secret put GITHUB_CLIENT_SECRET  # paste the Client Secret
   ```
   Secrets live only in Cloudflare — never in this repo.
3. Visit `https://grintbyte.com/admin/` and log in with GitHub. Editors need
   write access to `grintbyte/website`.

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

## Product checkout (Lemon Squeezy)

A product's **Buy now** button comes from `links.buy_url` (Products → Links →
Buy URL in the CMS). The sample product GrintDesk carries a placeholder
Lemon Squeezy URL (`.../buy/REPLACE-WITH-VARIANT-UUID`). To wire a real
checkout: create the product in your Lemon Squeezy store, copy its *Share →
Checkout link*, and paste it into Buy URL. No code change needed; when
`buy_url` is set it becomes the primary button on the product page.

## Solution enquiry (with auto-response)

The enquiry form lives on `/contact` (the Get in Touch page); each solution's
closing CTA links to it with the solution preselected via `?solution=<slug>`. It has three send modes, picked
automatically from **Pages → Contact** in the CMS:

1. **EmailJS configured** (recommended, free): sends a notification to the
   enquiry address AND an auto-reply to the client from the connected mailbox
   (team@grintbyte.com). Setup below.
2. **Only `form_action_url` set** (Web3Forms/Formspree): notification only.
   Note: Web3Forms' own autoresponder is a paid (Pro) feature.
3. **Nothing configured**: the button composes a pre-filled email in the
   visitor's mail app, addressed to the enquiry address. Works with no server.

### Google Sheets logging + email (Apps Script, free, no account limits)

One Apps Script attached to a Google Sheet can do everything at once: log
every enquiry as a row, email a notification to the team, and send the
auto-reply — all from grintbyte@gmail.com. No EmailJS needed.

1. In Google Drive (as grintbyte@gmail.com) create a spreadsheet, e.g.
   **GrintByte Enquiries** → Extensions → Apps Script, and paste:

   ```js
   const NOTIFY_TO = "grintbyte@gmail.com";

   function doPost(e) {
     const p = e.parameter;
     const ss = SpreadsheetApp.getActiveSpreadsheet();
     const sheet = ss.getSheetByName("Enquiries") || ss.insertSheet("Enquiries");
     if (sheet.getLastRow() === 0)
       sheet.appendRow(["Timestamp", "Name", "Email", "Company", "Solution", "Message"]);
     sheet.appendRow([new Date(), p.name, p.email, p.company || "", p.solution, p.message]);

     MailApp.sendEmail({
       to: NOTIFY_TO,
       replyTo: p.email,
       subject: "Solution enquiry: " + p.solution,
       body: "Name: " + p.name + "\nEmail: " + p.email + "\nCompany: " + (p.company || "-") +
         "\nSolution: " + p.solution + "\n\n" + p.message,
     });
     // Optional auto-reply to the client (uncomment when the copy is agreed):
     // MailApp.sendEmail({
     //   to: p.email,
     //   subject: "We received your enquiry",
     //   body: "Hi " + p.name + ",\n\nThanks for reaching out. We reply within one working day.\n\n— GrintByte",
     // });

     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

2. Deploy → **New deployment** → type **Web app** → Execute as **Me**,
   Who has access **Anyone** → Deploy, approve the permissions, copy the
   `/exec` URL.
3. Paste that URL into **Pages → Contact → Form endpoint URL** in the CMS.
   Done — the form's existing endpoint mode posts straight to it.

Quotas: MailApp can send ~100 emails/day on a free Gmail account; sheet rows
are unlimited. After editing the script, deploy a **new version** (Manage
deployments → edit → version: New) or the live URL keeps the old code.

### EmailJS setup (free plan: 200 requests/month, 2 templates — enough)

Each enquiry uses 2 requests (notify + auto-reply), so the free plan covers
about 100 enquiries per month.

1. **Make team@grintbyte.com able to send.** Cheapest free route if the domain
   has no mailbox yet: Cloudflare Email Routing (receive, forwards to
   grintbyte@gmail.com) + Gmail "Send mail as" alias for team@grintbyte.com
   (Gmail Settings → Accounts → Send mail as, verify the alias; create a Gmail
   App Password for SMTP).
2. **Create an EmailJS account** (emailjs.com) → Email Services → add
   *Custom SMTP*: `smtp.gmail.com`, port 465, user `grintbyte@gmail.com`,
   the App Password, and set the From address to `team@grintbyte.com`
   (must be a verified Gmail alias or Gmail rewrites it).
3. **Create 2 templates:**
   - *Notification* — To: `grintbyte@gmail.com`, Subject:
     `Solution enquiry: {{solution}}`, Body: `{{summary}}`,
     Reply-To: `{{email}}`.
   - *Auto-reply* — To: `{{email}}`, Subject: `We received your enquiry`,
     Body: thank-you text + `{{summary}}`, From name: GrintByte.
4. **Restrict the key**: EmailJS dashboard → Account → Security → allowlist
   your site's domain, so the public key only works from your pages.
5. Fill **Pages → Contact → EmailJS** in the CMS: public key, service ID and
   both template IDs. The public key is safe to publish; it can only send
   your two predefined templates from allowed domains.
