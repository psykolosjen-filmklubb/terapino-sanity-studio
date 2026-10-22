# Terapino Studio

Sanity CMS for the Terapino website. The dataset comes from
`SANITY_STUDIO_DATASET`: `npm run dev` uses `development` (from
`.env.development`), everything else defaults to `production`.

## Screenings and semesters

Each screening references its semester in **Semester**. The website archive
lists a screening under its semester once its date has passed.

- With **Automatisk semester** on (the default), publishing sets **Semester**
  from the screening date: January–June is **Vår YYYY**, July–December is
  **Høst YYYY**. A missing semester is created with a default, editable colour.
- Rescheduling a screening moves it to the right semester when it is published
  again. Until then the draft keeps the old reference; the editor shows what
  publishing will set.
- With **Automatisk semester** off, pick the semester yourself, or leave it
  empty to keep the screening out of the semester archive.
- Each semester's **Visninger** tab lists the screenings referencing it,
  including drafts.

Semesters are identified by **År** and **Semester** (spring or fall).
Validation allows one semester per year and season. The name, such as
**Høst 2026**, is derived from them when the semester is published.

Only the Studio's publish button sets the semester. Publishing through the API,
CLI or a release leaves the reference as it was.

Semester creation uses a deterministic ID and `createIfNotExists`, so
concurrent publishes do not create duplicates. If it fails, or a matching
semester exists only as an unpublished draft, the screening is not published
and an error is shown.

## Local verification

Use Node 22.13+ and npm:

```sh
npm test
npm run check
npm run build
```

Tests use in-memory data and never connect to Sanity.
