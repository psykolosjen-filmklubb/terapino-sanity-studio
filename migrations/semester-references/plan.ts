import { publishedId, semesterForDate } from "../../utils/semester.ts";

export type MigrationDocument = {
  _id: string;
  _type: string;
  _rev?: string;
  // semester
  semester_name?: string;
  semester_year?: number;
  semester_season?: string;
  screenings?: { _ref: string }[];
  // screening
  date?: string;
  auto_semester?: boolean;
};

export type PlannedPatch = {
  id: string;
  rev?: string;
  set: Record<string, unknown>;
};

/**
 * Plans the move to screening references. Every listed screening is already
 * in the semester its date gives, so screenings get that semester directly;
 * the old lists are only checked to confirm this still holds. Drafts are left
 * alone: the publish action sets the semester when they are published.
 * Documents already migrated are skipped, so the migration can be re-run.
 */
export function planSemesterReferences(
  documents: MigrationDocument[],
): PlannedPatch[] {
  const published = documents.filter(
    (document) => document._id === publishedId(document._id),
  );
  const semesters = published.filter((d) => d._type === "semester");
  const screenings = published.filter((d) => d._type === "screening");
  const problems: string[] = [];
  const patches: PlannedPatch[] = [];

  // Semesters: year and season from the name, keeping ID, name and colour.
  const semesterByPeriod = new Map<string, string>();
  for (const semester of semesters) {
    let year = semester.semester_year;
    let season = semester.semester_season;
    if (!year || !season) {
      const match = /^(Vår|Høst) (\d{4})$/.exec(semester.semester_name ?? "");
      if (!match) {
        problems.push(
          `${semester._id} ("${semester.semester_name ?? ""}"): navnet er ikke "Vår YYYY" eller "Høst YYYY".`,
        );
        continue;
      }
      year = Number(match[2]);
      season = match[1] === "Vår" ? "spring" : "fall";
      patches.push({
        id: semester._id,
        rev: semester._rev,
        set: { semester_year: year, semester_season: season },
      });
    }
    const period = `${year}-${season}`;
    const other = semesterByPeriod.get(period);
    if (other)
      problems.push(
        `${other} og ${semester._id} er begge semestre for ${period}.`,
      );
    semesterByPeriod.set(period, semester._id);
  }

  const listedIn = new Map<string, string[]>();
  for (const semester of semesters)
    for (const item of semester.screenings ?? [])
      listedIn.set(item._ref, [
        ...(listedIn.get(item._ref) ?? []),
        semester._id,
      ]);

  // Screenings: automatic, referencing the semester their date gives.
  for (const screening of screenings) {
    const period = semesterForDate(screening.date);
    if (!period) {
      problems.push(`${screening._id}: ugyldig dato "${screening.date}".`);
      continue;
    }
    const semesterId = semesterByPeriod.get(`${period.year}-${period.season}`);
    const listed = listedIn.get(screening._id) ?? [];
    if (listed.length > 0 && (listed.length > 1 || listed[0] !== semesterId))
      problems.push(
        `${screening._id} (${screening.date}) er oppført i ${listed.join(", ")}, ikke i semesteret datoen gir.`,
      );
    if (screening.auto_semester !== undefined) continue;
    patches.push({
      id: screening._id,
      rev: screening._rev,
      // Without a semester yet, the next publish creates and sets it.
      set: semesterId
        ? {
            auto_semester: true,
            semester: { _type: "reference", _ref: semesterId },
          }
        : { auto_semester: true },
    });
  }

  if (problems.length > 0)
    throw new Error(
      `Migreringen ble stoppet:\n${problems.map((p) => `- ${p}`).join("\n")}`,
    );
  return patches;
}
