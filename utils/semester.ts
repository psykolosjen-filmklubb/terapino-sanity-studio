import type { SanityClient } from "@sanity/client";

export type SemesterPeriod = {
  year: number;
  season: "spring" | "fall";
  name: string;
  id: string;
};

export type SemesterDocument = {
  _id: string;
  semester_name?: string;
  semester_year?: number;
  semester_season?: "spring" | "fall";
};

export const SEMESTERS_QUERY = `*[_type == "semester"]{
  _id, semester_name, semester_year, semester_season
}`;

// Shared SWR key so the publish action can refresh the screening editor's view.
export const SEMESTERS_SWR_KEY = "semesters";

/** Strips the draft or release-version prefix from a document ID. */
export function publishedId(id: string): string {
  return id.replace(/^drafts\./, "").replace(/^versions\.[^.]+\./, "");
}

function isPublishedDocument(document: SemesterDocument): boolean {
  return publishedId(document._id) === document._id;
}

/** Semester names are derived from year and season, e.g. "Høst 2026". */
export function semesterName(year: number, season: "spring" | "fall"): string {
  return `${season === "spring" ? "Vår" : "Høst"} ${year}`;
}

export function semesterForDate(date: unknown): SemesterPeriod | null {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  // JavaScript normalizes impossible dates (e.g. February 30); reject them by
  // comparing the parsed date with the original, using UTC to avoid time zones.
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  )
    return null;
  const year = Number(date.slice(0, 4));
  // Calendar half-years cover gaps between screenings, including summer dates.
  const season = Number(date.slice(5, 7)) <= 6 ? "spring" : "fall";
  return {
    year,
    season,
    name: semesterName(year, season),
    id: `semester-${year}-${season}`,
  };
}

export function matchesSemester(
  document: SemesterDocument,
  semester: SemesterPeriod,
): boolean {
  // Year and season are the identity; editors can rename a semester.
  return (
    document.semester_year === semester.year &&
    document.semester_season === semester.season
  );
}

export function findSemester(
  documents: SemesterDocument[],
  semester: SemesterPeriod,
): SemesterDocument | undefined {
  const matches = documents.filter((document) =>
    matchesSemester(document, semester),
  );
  if (matches.length > 1) {
    throw new Error(
      `Flere semesterprogrammer tilsvarer ${semester.name}. Rett semesterprogrammene, eller slå av automatisk semester.`,
    );
  }
  return matches[0];
}

export function findPublishedSemester(
  documents: SemesterDocument[],
  semester: SemesterPeriod,
): SemesterDocument | undefined {
  const published = findSemester(
    documents.filter(isPublishedDocument),
    semester,
  );
  // Pending edits to the same program are fine; a separate matching draft must
  // be finished by its editor rather than duplicated or overwritten.
  if (
    documents.some(
      (document) =>
        document._id.startsWith("drafts.") &&
        matchesSemester(document, semester) &&
        publishedId(document._id) !== published?._id,
    )
  ) {
    throw new Error(
      `Et upublisert semesterprogram for ${semester.name} finnes allerede. Publiser eller rett dette programmet først.`,
    );
  }
  // createIfNotExists would silently keep a different document at this ID.
  if (
    !published &&
    documents.some((document) => publishedId(document._id) === semester.id)
  ) {
    throw new Error(
      `Semester-ID-en for ${semester.name} brukes av et annet semester. Rett det semesteret, eller slå av automatisk semester.`,
    );
  }
  return published;
}

export async function validateSemester(
  client: Pick<SanityClient, "fetch">,
  document: SemesterDocument,
): Promise<true | string> {
  const { semester_year: year, semester_season: season } = document;
  if (!year || (season !== "spring" && season !== "fall")) return true;
  const semester = semesterForDate(
    `${year}-${season === "spring" ? "01" : "07"}-01`,
  );
  if (!semester) return "Velg et gyldig år og semester.";
  const id = publishedId(document._id);
  // Raw includes other editors' drafts, which would otherwise collide later.
  const documents = await client.fetch<SemesterDocument[]>(
    SEMESTERS_QUERY,
    {},
    { perspective: "raw" },
  );
  return documents.some(
    (candidate) =>
      publishedId(candidate._id) !== id && matchesSemester(candidate, semester),
  )
    ? `${semester.name} finnes allerede.`
    : true;
}

// The color input needs all color spaces to keep generated colors editable.
const DEFAULT_COLORS = {
  spring: {
    hex: "#6b8e72",
    rgb: { _type: "rgbaColor", r: 107, g: 142, b: 114, a: 1 },
    hsl: { _type: "hslaColor", h: 132, s: 0.140562, l: 0.488235, a: 1 },
    hsv: { _type: "hsvaColor", h: 132, s: 0.246479, v: 0.556863, a: 1 },
  },
  fall: {
    hex: "#b87645",
    rgb: { _type: "rgbaColor", r: 184, g: 118, b: 69, a: 1 },
    hsl: { _type: "hslaColor", h: 25.565217, s: 0.454545, l: 0.496078, a: 1 },
    hsv: { _type: "hsvaColor", h: 25.565217, s: 0.625, v: 0.721569, a: 1 },
  },
};

/**
 * Finds the semester for a screening date, creating it if missing, and
 * returns its ID. Only publishing calls this, so opening an editor or changing
 * a date never creates empty semesters.
 */
export async function ensureSemester(
  client: Pick<SanityClient, "fetch" | "createIfNotExists">,
  date: unknown,
): Promise<string> {
  const semester = semesterForDate(date);
  if (!semester) throw new Error("Velg en gyldig visningsdato.");
  const documents = await client.fetch<SemesterDocument[]>(
    SEMESTERS_QUERY,
    {},
    { perspective: "raw" },
  );
  const existing = findPublishedSemester(documents, semester);
  if (existing) return existing._id;
  // The same year/season gives every editor the same ID, so concurrent
  // publishes create one semester without replacing names or colours.
  await client.createIfNotExists({
    _id: semester.id,
    _type: "semester",
    semester_year: semester.year,
    semester_season: semester.season,
    semester_name: semester.name,
    color: { _type: "color", alpha: 1, ...DEFAULT_COLORS[semester.season] },
  });
  return semester.id;
}
