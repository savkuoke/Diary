# Diary — lifestyle entries

Small Next.js app to record daily weight, steps, mood and notes backed by a JSON file.

Run locally:

```bash
npm install
npm run dev
```

Data is stored in `data/diary.json` and the simple API is at `/api/entries`.

Notes:
- This project uses a file-backed store for demo purposes. For production use a proper DB.
- Don't commit `node_modules` or `.next` to git; use `.gitignore`.
## Lifestyle Diary (Next.js)

Simple Next.js app to track daily lifestyle metrics (weight, steps, mood, notes).

Getting started

1. Install dependencies

```bash
cd /Users/mainuser/Projects/Diary
npm install
```

2. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. The app stores entries in `data/diary.json` and exposes a small API at `/api/entries` (GET/POST/DELETE).

Notes

- This is a minimal prototype intended for local use. For production you should replace JSON file storage with a database and add authentication.
- Files added: `pages/*`, `pages/api/*`, `lib/storage.js`, `data/diary.json`, `styles/*`, `package.json`.

If you want, I can:

- Add validation and better error handling on the API
- Add edit/update support and filtering by date
- Add tests and a simple CI workflow

Change log (initial): created basic scaffold and API
##koe