# Birthday Wish Page

A minimal professional 3D birthday page with team wishes stored in `wishes.json`.

## Quick start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Customize

1. **Honoree name** — Edit `HONOREE_NAME` in `public/js/app.js`.
2. **Hero copy** — Edit the headline and lead text in `public/index.html`.
3. **Seed wishes** — Edit `wishes.json` directly (must stay valid JSON array).

## How wishes work

- Wishes are saved to `wishes.json` at the project root.
- `GET /api/wishes` returns all wishes (newest first).
- `POST /api/wishes` accepts `{ "name": "...", "message": "..." }` and appends to the file.

Share the running URL on your local network so teammates can add messages. For production, deploy behind any Node host that can write to disk (or swap storage later).
