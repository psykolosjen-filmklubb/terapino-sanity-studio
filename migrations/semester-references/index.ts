import { at, defineMigration, patch, set } from "sanity/migrate";
import { planSemesterReferences, type MigrationDocument } from "./plan.ts";

// Dry run (default): npx sanity migration run semester-references --project 4s9wdr84 --dataset development
// Apply:             add --no-dry-run
export default defineMigration({
  title: "Move semester membership from semester lists to screening references",
  documentTypes: ["semester", "screening"],
  async *migrate(documents) {
    const all: MigrationDocument[] = [];
    for await (const document of documents())
      all.push(document as MigrationDocument);
    for (const planned of planSemesterReferences(all)) {
      yield patch(
        planned.id,
        Object.entries(planned.set).map(([path, value]) =>
          at(path, set(value)),
        ),
        // Fail, rather than overwrite, if a document changed since it was read.
        { ifRevision: planned.rev },
      );
    }
  },
});
