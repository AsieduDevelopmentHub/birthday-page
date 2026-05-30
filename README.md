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
| **Build Command** | *(leave empty)* |
| **Output Directory** | *(leave empty)* |
| **Install Command** | `npm install` |
| **Development Command** | `npm run dev` *(optional, for Vercel CLI)* |

4. **Do not** set a Production **Start Command** — Vercel uses serverless functions, not `node server.js`.
5. After deploy, open **Storage** → create a **Blob** store and connect it to the project. This sets `BLOB_READ_WRITE_TOKEN` so new wishes persist (without Blob, the site loads but posting wishes may fail in production).
6. Optional: add environment variable **`SITE_URL`** = `https://your-project.vercel.app` (no trailing slash). Used only if you add a custom domain later for absolute share URLs.

Redeploy after adding Blob storage.

## Share preview (WhatsApp, iMessage, Slack, etc.)

Meta tags in `public/index.html` use Yaw’s photo for Open Graph / Twitter cards. Social apps resolve `/image/YawSafoMarfo.jpg` against your live URL after deploy.

## Customize

- **Name / brand** — `public/js/app.js` (`HONOREE_NAME`, `BRAND_NAME`)
- **Copy & meta** — `public/index.html`
- **Seed wishes** — `wishes.json`
