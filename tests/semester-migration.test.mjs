import assert from "node:assert/strict";
import { test } from "node:test";
import { planSemesterReferences } from "../migrations/semester-references/plan.ts";

function semester(id, name, screenings = [], extra = {}) {
  return {
    _id: id,
    _type: "semester",
    _rev: `rev-${id}`,
    semester_name: name,
    screenings: screenings.map((_ref) => ({ _ref })),
    ...extra,
  };
}

function screening(id, date, extra = {}) {
  return { _id: id, _type: "screening", _rev: `rev-${id}`, date, ...extra };
}

function setFor(patches, id) {
  return patches.find((patch) => patch.id === id)?.set;
}

test("semesters get a year and season from their names", () => {
  const patches = planSemesterReferences([
    semester("s", "Vår 2026"),
    semester("f", "Høst 2026"),
  ]);
  assert.deepEqual(setFor(patches, "s"), {
    semester_year: 2026,
    semester_season: "spring",
  });
  assert.equal(setFor(patches, "f").semester_season, "fall");
  assert.equal(patches.find((patch) => patch.id === "s").rev, "rev-s");
});

test("screenings reference the semester their date gives, listed or not", () => {
  const patches = planSemesterReferences([
    semester("f", "Høst 2026", ["listed"]),
    screening("listed", "2026-09-01"),
    screening("unlisted", "2026-10-27"),
    screening("no-semester-yet", "2027-03-01"),
    screening("drafts.listed", "2026-09-01"),
  ]);
  const expected = {
    auto_semester: true,
    semester: { _type: "reference", _ref: "f" },
  };
  assert.deepEqual(setFor(patches, "listed"), expected);
  assert.deepEqual(setFor(patches, "unlisted"), expected);
  assert.deepEqual(setFor(patches, "no-semester-yet"), { auto_semester: true });
  assert.equal(setFor(patches, "drafts.listed"), undefined);
});

test("already migrated documents are skipped, so the migration can be re-run", () => {
  const patches = planSemesterReferences([
    semester("s", "Vår 2026", ["a"], {
      semester_year: 2026,
      semester_season: "spring",
    }),
    screening("a", "2026-03-01", { auto_semester: true }),
  ]);
  assert.deepEqual(patches, []);
});

test("data that breaks the date rule stops the migration before any patch", () => {
  for (const documents of [
    [semester("series", "Kurosawa-serien")],
    [semester("one", "Vår 2026"), semester("two", "Vår 2026")],
    [semester("s", "Vår 2026", ["a"]), screening("a", "2026-09-01")],
    [
      semester("s", "Vår 2026", ["a"]),
      semester("f", "Høst 2026", ["a"]),
      screening("a", "2026-03-01"),
    ],
    [screening("a", "2026-02-30")],
  ]) {
    assert.throws(
      () => planSemesterReferences(documents),
      /Migreringen ble stoppet/,
    );
  }
});
