# Birthday Wish Page — Yaw Safo Marfo

Professional 3D birthday page with team wishes.

## Tech stack

| Layer | Technology |
|--------|------------|
| Frontend | HTML, CSS, vanilla JS, [Three.js](https://threejs.org/) (3D scene) |
| Local API | [Express](https://expressjs.com/) (`server.js`) |
| Production API | Vercel Serverless Functions (`api/wishes.js`) |
| Wish storage (local) | `wishes.json` on disk |
| Wish storage (Vercel) | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (JSON file) |
| Hosting | [Vercel](https://vercel.com/) — no `vercel.json` required |

Vercel automatically serves files in `public/` and maps `/api/wishes` to `api/wishes.js`.

## Local development

```bash
npm install
npm start
```

Open http://localhost:3000

## Deploy on Vercel (dashboard only — no `vercel.json`)

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new) → **Import** the repository.
3. Use these project settings:

| Setting | Value |
|---------|--------|
| **Framework Preset** | Other |
| **Root Directory** | `./` (default) |
| **Build Command** | `npm run build` |
| **Output Directory** | *(leave empty)* |
| **Install Command** | `npm install` |
| **Development Command** | `npm run dev` *(optional, for Vercel CLI)* |

4. **Do not** set a Production **Start Command** — Vercel uses serverless functions, not `node server.js`.
5. After deploy, open **Storage** → create a **Blob** store and connect it to the project. This sets `BLOB_READ_WRITE_TOKEN` so new wishes persist (without Blob, the site loads but posting wishes may fail in production).
6. Add **`SITE_URL`** = `https://your-project.vercel.app` (no trailing slash) — production domain used for WhatsApp/link preview images. Vercel’s `VERCEL_URL` is used as a fallback during build if `SITE_URL` is not set.
7. **Redeploy** after any env or Blob change.

## Share preview (WhatsApp, iMessage, Slack, etc.)

WhatsApp and Facebook **do not** load preview images from relative paths like `/image/...`. They require a full URL, e.g. `https://your-site.vercel.app/image/YawSafoMarfo.jpg`.

The `npm run build` step replaces `__SITE_ORIGIN__` in `index.html` with your live domain on each Vercel deploy.

**If the image still does not show after redeploy:**

1. Open `https://your-domain.vercel.app/image/YawSafoMarfo.jpg` in a browser — it must load publicly.
2. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → paste your site URL → **Scrape Again** (WhatsApp uses the same cache).
3. Share the link again in WhatsApp (previews are cached for hours).

## Customize

- **Name / brand** — `public/js/app.js` (`HONOREE_NAME`, `BRAND_NAME`)
- **Copy & meta** — `public/index.html`
- **Seed wishes** — `wishes.json`
