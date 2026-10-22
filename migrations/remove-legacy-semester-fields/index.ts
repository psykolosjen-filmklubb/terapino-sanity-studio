import { at, defineMigration, unset } from "sanity/migrate";

// Run only after the semester-references migration, and after both the
// website and the Studio that read screening references are deployed.
// Dry run (default): npx sanity migration run remove-legacy-semester-fields --project 4s9wdr84 --dataset development
export default defineMigration({
  title: "Remove legacy screening lists and start dates from semesters",
  documentTypes: ["semester"],
  filter: "defined(screenings) || defined(start_date)",
  migrate: {
    document() {
      return [at("screenings", unset()), at("start_date", unset())];
    },
  },
});
