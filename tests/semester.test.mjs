import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ensureSemester,
  findSemester,
  semesterForDate,
  validateSemester,
} from "../utils/semester.ts";

test("semesters cover calendar half-years and reject invalid dates", () => {
  for (const [date, year, season] of [
    ["2027-01-01", 2027, "spring"],
    ["2027-06-30", 2027, "spring"],
    ["2027-07-01", 2027, "fall"],
    ["2027-12-31", 2027, "fall"],
    ["2028-01-01", 2028, "spring"],
  ]) {
    assert.equal(semesterForDate(date).year, year);
    assert.equal(semesterForDate(date).season, season);
  }
  for (const date of [undefined, "", "2027-02-29", "2027-13-01", "2027-1-1"])
    assert.equal(semesterForDate(date), null);
  assert.equal(semesterForDate("2028-02-29").season, "spring");
  assert.equal(semesterForDate("2027-06-30").name, "Vår 2027");
  assert.equal(semesterForDate("2027-07-01").name, "Høst 2027");
});

const spring2027 = {
  _id: "old-id",
  semester_name: "Vår 2027",
  semester_year: 2027,
  semester_season: "spring",
};

test("publishing reuses an existing semester and returns its ID", async () => {
  const id = await ensureSemester(
    {
      fetch: async () => [spring2027],
      createIfNotExists: async () =>
        assert.fail("Must not create or update an existing semester"),
    },
    "2027-03-12",
  );
  assert.equal(id, "old-id");
});

test("explicit year and season identify a renamed semester", async () => {
  await ensureSemester(
    {
      fetch: async () => [
        {
          _id: "renamed",
          semester_name: "Vårens filmer",
          semester_year: 2027,
          semester_season: "spring",
        },
      ],
      createIfNotExists: async () =>
        assert.fail("Must reuse the renamed semester"),
    },
    "2027-03-12",
  );
});

test("a semester is created with year, season, name and editable colour", async () => {
  const created = [];
  const id = await ensureSemester(
    {
      fetch: async () => [spring2027],
      createIfNotExists: async (document) => {
        created.push(document);
      },
    },
    "2027-10-27",
  );
  assert.equal(id, "semester-2027-fall");
  assert.equal(created.length, 1);
  assert.equal(created[0]._id, "semester-2027-fall");
  assert.equal(created[0].semester_year, 2027);
  assert.equal(created[0].semester_season, "fall");
  assert.equal(created[0].semester_name, "Høst 2027");
  assert.equal(created[0].start_date, undefined);
  assert.ok(created[0].color.hex);
  assert.ok(created[0].color.hsl);
  assert.ok(created[0].color.hsv);
  assert.ok(created[0].color.rgb);
});

test("concurrent publishes use create-if-not-exists with the same deterministic ID", async () => {
  const stored = new Map();
  const requests = [];
  const client = {
    fetch: async () => [],
    createIfNotExists: async (document) => {
      requests.push(document._id);
      if (!stored.has(document._id)) stored.set(document._id, document);
    },
  };
  await Promise.all([
    ensureSemester(client, "2027-01-20"),
    ensureSemester(client, "2027-06-30"),
  ]);
  assert.deepEqual(requests, ["semester-2027-spring", "semester-2027-spring"]);
  assert.equal(stored.size, 1);
});

test("ambiguous semesters, invalid dates, and backend failures stop provisioning", async () => {
  const semester = semesterForDate("2027-03-12");
  assert.throws(
    () =>
      findSemester(
        [
          { ...spring2027, _id: "one" },
          {
            _id: "two",
            semester_year: 2027,
            semester_season: "spring",
          },
        ],
        semester,
      ),
    /Flere semesterprogrammer/,
  );
  const client = {
    fetch: async () => [],
    createIfNotExists: async () => {
      throw new Error("Permission denied");
    },
  };
  await assert.rejects(
    ensureSemester(client, "invalid"),
    /gyldig visningsdato/,
  );
  await assert.rejects(
    ensureSemester(client, "2027-03-12"),
    /Permission denied/,
  );
});

test("an occupied deterministic ID cannot silently publish into the wrong semester", async () => {
  await assert.rejects(
    ensureSemester(
      {
        fetch: async () => [
          {
            _id: "semester-2027-spring",
            semester_name: "Something else",
            semester_year: 2026,
            semester_season: "fall",
          },
        ],
        createIfNotExists: async () =>
          assert.fail("Must not overwrite another semester"),
      },
      "2027-03-12",
    ),
    /brukes av et annet semester/,
  );
});

test("semester validation ignores the document's own draft", async () => {
  const client = { fetch: async () => [spring2027] };
  assert.equal(
    await validateSemester(client, {
      ...spring2027,
      _id: "drafts.old-id",
    }),
    true,
  );
  assert.match(
    await validateSemester(client, { ...spring2027, _id: "drafts.new" }),
    /finnes allerede/,
  );
});

test("semester uniqueness validation includes other drafts", async () => {
  const candidate = {
    _id: "drafts.semester-2027-spring",
    semester_year: 2027,
    semester_season: "spring",
  };
  assert.match(
    await validateSemester(
      {
        fetch: async (_query, _params, options) => {
          assert.equal(options.perspective, "raw");
          return [{ ...candidate, _id: "drafts.other" }];
        },
      },
      candidate,
    ),
    /finnes allerede/,
  );
});

test("existing semester drafts are not silently overwritten or duplicated", async () => {
  await assert.rejects(
    ensureSemester(
      {
        fetch: async (_query, _params, options) => {
          assert.equal(options.perspective, "raw");
          return [{ ...spring2027, _id: "drafts.other" }];
        },
        createIfNotExists: async () =>
          assert.fail("Must not bypass an unpublished semester"),
      },
      "2027-03-12",
    ),
    /upublisert semesterprogram/,
  );
  await ensureSemester(
    {
      fetch: async () => [spring2027, { ...spring2027, _id: "drafts.old-id" }],
      createIfNotExists: async () =>
        assert.fail("Must reuse published semester with pending edits"),
    },
    "2027-03-12",
  );
});

test("semesters without year and season, and release versions, are not used", async () => {
  const created = [];
  await ensureSemester(
    {
      fetch: async () => [
        { _id: "untyped", semester_name: "Vår 2027" },
        { ...spring2027, _id: "versions.r1.old-id" },
      ],
      createIfNotExists: async (document) => {
        created.push(document._id);
      },
    },
    "2027-03-12",
  );
  assert.deepEqual(created, ["semester-2027-spring"]);
});
