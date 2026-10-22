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

## Migrating from semester screening lists

Semesters used to list their screenings in `semester.screenings`. Two
migrations in `migrations/` move to screening references. Both run as a dry
run unless `--no-dry-run` is passed.

1. `semester-references` sets `semester_year` and `semester_season` on each
   published semester from its name, which must be **Vår YYYY** or
   **Høst YYYY**. Each published screening gets **Automatisk semester** and a
   reference to the semester its date gives. It first checks that every
   screening in an old list is listed in exactly that semester, and stops
   without writing anything if not. Drafts are left alone; publishing them in
   the new Studio sets their semester. It skips migrated documents, so it can
   be re-run.

   ```sh
   npx sanity migration run semester-references --project 4s9wdr84 --dataset development
   ```

2. Deploy the website archive change, then this Studio (`npm run deploy`). Run
   step 1 again to pick up screenings published in the old Studio meanwhile.
3. `remove-legacy-semester-fields` removes the old lists and start dates.
   Afterwards, delete the hidden `screenings` and `start_date` fields from
   `schemas/documents/semester.tsx`.

## Local verification

Use Node 22.12+ and npm:

```sh
npm test
npm run check
npm run build
```

Tests use in-memory data and never connect to Sanity.
